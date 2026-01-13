import { Router, Response } from 'express';
import { listActivityLogsQuerySchema } from '@applytrack/shared';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';
import { apiLimiter } from '../middleware/rate-limit';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// List activity logs with filters and pagination
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const query = listActivityLogsQuerySchema.parse(req.query);
    const { page, pageSize, ...filters } = query;

    // Build where clause
    const where: any = {
      userId: req.user.userId,
    };

    if (filters.jobApplicationId) where.jobApplicationId = filters.jobApplicationId;
    if (filters.eventType) where.eventType = filters.eventType;

    // Get total count
    const totalItems = await prisma.activityLog.count({ where });

    // Get paginated results with job application details
    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        jobApplication: {
          select: {
            company: true,
            roleTitle: true,
          },
        },
      },
    });

    res.json({
      data: logs.map((log: any) => ({
        id: log.id,
        userId: log.userId,
        jobApplicationId: log.jobApplicationId,
        eventType: log.eventType,
        description: log.description,
        metadata: log.metadata,
        createdAt: log.createdAt.toISOString(),
        jobApplication: log.jobApplication,
      })),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
