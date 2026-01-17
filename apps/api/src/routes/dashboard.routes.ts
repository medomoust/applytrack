import { Router, Response } from 'express';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';
import { apiLimiter } from '../middleware/rate-limit';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// Get dashboard statistics
router.get('/stats', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const userId = req.user.userId;
    const isRecruiter = req.user.role === 'recruiter';

    // Build where clause
    const where: any = { archived: false };
    
    if (isRecruiter) {
      // Recruiters see applications to their company's jobs
      const recruiter = await prisma.user.findUnique({
        where: { id: userId },
        select: { company: true },
      });
      
      if (recruiter?.company) {
        where.company = recruiter.company;
      }
    } else {
      // Applicants see only their own applications
      where.userId = userId;
    }

    // Get counts by status
    const statusCounts = await prisma.jobApplication.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    // Total applications
    const total = await prisma.jobApplication.count({ where });

    // Applications this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const appliedThisWeek = await prisma.jobApplication.count({
      where: {
        ...where,
        appliedDate: { gte: weekAgo },
      },
    });

    // Interviews
    const interviews = await prisma.jobApplication.count({
      where: {
        ...where,
        status: 'interview',
      },
    });

    // Offers
    const offers = await prisma.jobApplication.count({
      where: {
        ...where,
        status: 'offer',
      },
    });

    // Applications by status
    const byStatus = statusCounts.reduce((acc: any, item: any) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    // Timeline data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timelineData = await prisma.jobApplication.findMany({
      where: {
        ...where,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const timeline = timelineData.reduce((acc: any, item: any) => {
      const date = item.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, count: 0 };
      }
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, { date: string; count: number }>);

    // Additional stats for recruiters
    let recruiterStats = {};
    if (isRecruiter) {
      const recruiter = await prisma.user.findUnique({
        where: { id: userId },
        select: { company: true },
      });

      if (recruiter?.company) {
        // Count open job postings
        const openPositions = await prisma.jobPosting.count({
          where: {
            company: recruiter.company,
            status: 'open',
          },
        });

        recruiterStats = {
          openPositions,
          uniqueApplicants: await prisma.jobApplication.findMany({
            where: { company: recruiter.company },
            distinct: ['userId'],
          }).then(apps => apps.length),
        };
      }
    }

    res.json({
      kpis: {
        total,
        appliedThisWeek,
        interviews,
        offers,
        ...recruiterStats,
      },
      byStatus,
      timeline: Object.values(timeline),
    });
  } catch (error) {
    next(error);
  }
});

// Get recent activity
router.get('/activity', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const logs = await prisma.activityLog.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        jobApplication: {
          select: {
            company: true,
            roleTitle: true,
          },
        },
      },
    });

    res.json(
      logs.map((log: any) => ({
        id: log.id,
        eventType: log.eventType,
        description: log.description,
        createdAt: log.createdAt.toISOString(),
        jobApplication: log.jobApplication,
      }))
    );
  } catch (error) {
    next(error);
  }
});

export default router;
