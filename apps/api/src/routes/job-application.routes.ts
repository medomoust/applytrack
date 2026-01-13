import { Router, Response } from 'express';
import {
  createJobApplicationSchema,
  updateJobApplicationSchema,
  listJobApplicationsQuerySchema,
  ActivityEventType,
} from '@applytrack/shared';
import prisma from '../db/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';
import { apiLimiter } from '../middleware/rate-limit';
import { createActivityLog } from '../utils/activity-logger';

const router = Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// List job applications with filters and pagination
router.get('/', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const query = listJobApplicationsQuerySchema.parse(req.query);
    const { page, pageSize, sortBy, sortOrder, ...filters } = query;

    // Build where clause
    const where: any = {
      userId: req.user.userId,
    };

    if (filters.status) where.status = filters.status;
    if (filters.workMode) where.workMode = filters.workMode;
    if (filters.employmentType) where.employmentType = filters.employmentType;
    if (filters.priority) where.priority = filters.priority;
    if (filters.archived !== undefined) where.archived = filters.archived;

    if (filters.search) {
      where.OR = [
        { company: { contains: filters.search, mode: 'insensitive' } },
        { roleTitle: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    // Get total count
    const totalItems = await prisma.jobApplication.count({ where });

    // Get paginated results
    const applications = await prisma.jobApplication.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    res.json({
      data: applications.map((app: any) => ({
        ...app,
        salaryTarget: app.salaryTarget ? Number(app.salaryTarget) : null,
        appliedDate: app.appliedDate?.toISOString() || null,
        nextFollowUpDate: app.nextFollowUpDate?.toISOString() || null,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
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

// Get single job application
router.get('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    if (application.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied');
    }

    res.json({
      ...application,
      salaryTarget: application.salaryTarget ? Number(application.salaryTarget) : null,
      appliedDate: application.appliedDate?.toISOString() || null,
      nextFollowUpDate: application.nextFollowUpDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Create job application
router.post('/', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const data = createJobApplicationSchema.parse(req.body);

    const application = await prisma.jobApplication.create({
      data: {
        userId: req.user.userId,
        company: data.company,
        roleTitle: data.roleTitle,
        location: data.location,
        workMode: data.workMode,
        employmentType: data.employmentType,
        status: data.status,
        priority: data.priority,
        appliedDate: data.appliedDate ? new Date(data.appliedDate) : null,
        nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,
        salaryTarget: data.salaryTarget,
        link: data.link || null,
        notes: data.notes,
      },
    });

    // Log activity
    await createActivityLog({
      userId: req.user.userId,
      jobApplicationId: application.id,
      eventType: ActivityEventType.CREATED,
      description: `Created application for ${data.roleTitle} at ${data.company}`,
    });

    res.status(201).json({
      ...application,
      salaryTarget: application.salaryTarget ? Number(application.salaryTarget) : null,
      appliedDate: application.appliedDate?.toISOString() || null,
      nextFollowUpDate: application.nextFollowUpDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Update job application
router.patch('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const existing = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    if (existing.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied');
    }

    const data = updateJobApplicationSchema.parse(req.body);

    const updateData: any = {};
    if (data.company !== undefined) updateData.company = data.company;
    if (data.roleTitle !== undefined) updateData.roleTitle = data.roleTitle;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.workMode !== undefined) updateData.workMode = data.workMode;
    if (data.employmentType !== undefined) updateData.employmentType = data.employmentType;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.appliedDate !== undefined) updateData.appliedDate = data.appliedDate ? new Date(data.appliedDate) : null;
    if (data.nextFollowUpDate !== undefined) updateData.nextFollowUpDate = data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null;
    if (data.salaryTarget !== undefined) updateData.salaryTarget = data.salaryTarget;
    if (data.link !== undefined) updateData.link = data.link || null;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const application = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: updateData,
    });

    // Log activity
    let description = `Updated application for ${application.roleTitle} at ${application.company}`;
    if (data.status && data.status !== existing.status) {
      await createActivityLog({
        userId: req.user.userId,
        jobApplicationId: application.id,
        eventType: ActivityEventType.STATUS_CHANGED,
        description: `Changed status from ${existing.status} to ${data.status}`,
        metadata: { oldStatus: existing.status, newStatus: data.status },
      });
    } else {
      await createActivityLog({
        userId: req.user.userId,
        jobApplicationId: application.id,
        eventType: ActivityEventType.UPDATED,
        description,
      });
    }

    res.json({
      ...application,
      salaryTarget: application.salaryTarget ? Number(application.salaryTarget) : null,
      appliedDate: application.appliedDate?.toISOString() || null,
      nextFollowUpDate: application.nextFollowUpDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Archive job application
router.post('/:id/archive', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const existing = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    if (existing.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied');
    }

    const application = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: { archived: true },
    });

    // Log activity
    await createActivityLog({
      userId: req.user.userId,
      jobApplicationId: application.id,
      eventType: ActivityEventType.ARCHIVED,
      description: `Archived application for ${application.roleTitle} at ${application.company}`,
    });

    res.json({
      ...application,
      salaryTarget: application.salaryTarget ? Number(application.salaryTarget) : null,
      appliedDate: application.appliedDate?.toISOString() || null,
      nextFollowUpDate: application.nextFollowUpDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Restore job application
router.post('/:id/restore', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const existing = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    if (existing.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied');
    }

    const application = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: { archived: false },
    });

    // Log activity
    await createActivityLog({
      userId: req.user.userId,
      jobApplicationId: application.id,
      eventType: ActivityEventType.RESTORED,
      description: `Restored application for ${application.roleTitle} at ${application.company}`,
    });

    res.json({
      ...application,
      salaryTarget: application.salaryTarget ? Number(application.salaryTarget) : null,
      appliedDate: application.appliedDate?.toISOString() || null,
      nextFollowUpDate: application.nextFollowUpDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Delete job application
router.delete('/:id', async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError(401, 'Authentication required');
    }

    const existing = await prisma.jobApplication.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    if (existing.userId !== req.user.userId) {
      throw new AppError(403, 'Access denied');
    }

    await prisma.jobApplication.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
