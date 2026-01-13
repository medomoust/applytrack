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

    // Get counts by status
    const statusCounts = await prisma.jobApplication.groupBy({
      by: ['status'],
      where: {
        userId,
        archived: false,
      },
      _count: true,
    });

    // Total applications
    const total = await prisma.jobApplication.count({
      where: { userId, archived: false },
    });

    // Applications this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const appliedThisWeek = await prisma.jobApplication.count({
      where: {
        userId,
        archived: false,
        status: 'applied',
        appliedDate: { gte: weekAgo },
      },
    });

    // Interviews
    const interviews = await prisma.jobApplication.count({
      where: {
        userId,
        archived: false,
        status: 'interview',
      },
    });

    // Offers
    const offers = await prisma.jobApplication.count({
      where: {
        userId,
        archived: false,
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
        userId,
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

    res.json({
      kpis: {
        total,
        appliedThisWeek,
        interviews,
        offers,
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
