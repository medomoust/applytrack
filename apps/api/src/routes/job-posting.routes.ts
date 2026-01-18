import { Router } from 'express';
import {
  createJobPostingSchema,
  updateJobPostingSchema,
  listJobPostingsQuerySchema,
  applyToJobPostingSchema,
  ActivityEventType,
} from '@applytrack/shared';
import prisma from '../db/prisma';
import { AppError } from '../middleware/error-handler';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { createActivityLog } from '../utils/activity-logger';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create job posting (recruiters only)
router.post('/', requireRole('recruiter'), async (req: AuthRequest, res, next) => {
  try {
    const data = createJobPostingSchema.parse(req.body);
    
    // Get recruiter's company
    const recruiter = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { company: true },
    });

    if (!recruiter?.company) {
      throw new AppError(400, 'Recruiter must have a company assigned');
    }

    // Ensure posting is for recruiter's own company
    if (data.company !== recruiter.company) {
      throw new AppError(403, 'You can only create job postings for your own company');
    }

    const jobPosting = await prisma.jobPosting.create({
      data: {
        ...data,
        recruiterId: req.user!.userId,
      },
    });

    res.status(201).json({
      ...jobPosting,
      createdAt: jobPosting.createdAt.toISOString(),
      updatedAt: jobPosting.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// List job postings
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const query = listJobPostingsQuerySchema.parse(req.query);
    const { page, pageSize, sortBy, sortOrder, company, workMode, employmentType, status, search } = query;

    const where: any = {};

    // Recruiters only see their company's postings
    if (req.user!.role === 'recruiter') {
      const recruiter = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { company: true },
      });
      
      console.log('🔍 Job Posting - Recruiter filtering:', {
        userId: req.user!.userId,
        recruiterCompany: recruiter?.company,
        userRole: req.user!.role,
      });
      
      where.company = recruiter?.company;
    }

    // Applicants only see open postings
    if (req.user!.role === 'applicant') {
      where.status = 'open';
    }

    // Apply filters
    if (company) where.company = company;
    if (workMode) where.workMode = workMode;
    if (employmentType) where.employmentType = employmentType;
    if (status && req.user!.role === 'recruiter') where.status = status;
    
    console.log('📋 Final WHERE clause for job postings:', JSON.stringify(where, null, 2));
    
    if (search) {
      where.OR = [
        { roleTitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [jobPostings, totalItems] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.jobPosting.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      data: jobPostings.map((posting) => ({
        ...posting,
        createdAt: posting.createdAt.toISOString(),
        updatedAt: posting.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single job posting
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!jobPosting) {
      throw new AppError(404, 'Job posting not found');
    }

    // Recruiters can only see their company's postings
    if (req.user!.role === 'recruiter') {
      const recruiter = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { company: true },
      });
      
      if (jobPosting.company !== recruiter?.company) {
        throw new AppError(403, 'Access denied');
      }
    }

    // Applicants can only see open postings
    if (req.user!.role === 'applicant' && jobPosting.status !== 'open') {
      throw new AppError(404, 'Job posting not found');
    }

    res.json({
      ...jobPosting,
      createdAt: jobPosting.createdAt.toISOString(),
      updatedAt: jobPosting.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Update job posting (recruiters only, own postings)
router.put('/:id', requireRole('recruiter'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = updateJobPostingSchema.parse(req.body);

    const existing = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(404, 'Job posting not found');
    }

    // Only the recruiter who created it can update
    if (existing.recruiterId !== req.user!.userId) {
      throw new AppError(403, 'You can only update your own job postings');
    }

    const jobPosting = await prisma.jobPosting.update({
      where: { id },
      data,
    });

    res.json({
      ...jobPosting,
      createdAt: jobPosting.createdAt.toISOString(),
      updatedAt: jobPosting.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Delete job posting (recruiters only, own postings)
router.delete('/:id', requireRole('recruiter'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(404, 'Job posting not found');
    }

    // Only the recruiter who created it can delete
    if (existing.recruiterId !== req.user!.userId) {
      throw new AppError(403, 'You can only delete your own job postings');
    }

    await prisma.jobPosting.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Apply to job posting (applicants only)
router.post('/:id/apply', requireRole('applicant'), async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = applyToJobPostingSchema.parse(req.body);

    // Get the job posting
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id },
    });

    if (!jobPosting) {
      throw new AppError(404, 'Job posting not found');
    }

    if (jobPosting.status !== 'open') {
      throw new AppError(400, 'This job posting is no longer accepting applications');
    }

    // Check if user already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        userId: req.user!.userId,
        jobPostingId: id,
      },
    });

    if (existingApplication) {
      throw new AppError(400, 'You have already applied to this job posting');
    }

    // Get applicant's name
    const applicant = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { name: true },
    });

    if (!applicant?.name) {
      throw new AppError(400, 'User name is required to apply');
    }

    // Create job application
    const application = await prisma.jobApplication.create({
      data: {
        userId: req.user!.userId,
        jobPostingId: id,
        applicantName: applicant.name,
        company: jobPosting.company,
        roleTitle: jobPosting.roleTitle,
        location: jobPosting.location,
        workMode: jobPosting.workMode,
        employmentType: jobPosting.employmentType,
        status: 'applied',
        notes: data.notes,
        salaryTarget: data.salaryTarget,
      },
    });

    // Create activity log
    await createActivityLog({
      userId: req.user!.userId,
      jobApplicationId: application.id,
      eventType: ActivityEventType.CREATED,
      description: `Applied to ${jobPosting.roleTitle} at ${jobPosting.company}`,
    });

    res.status(201).json({
      ...application,
      appliedDate: application.appliedDate.toISOString(),
      nextFollowUpDate: application.nextFollowUpDate?.toISOString() || null,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
