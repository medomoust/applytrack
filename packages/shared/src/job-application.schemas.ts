import { z } from 'zod';
import { WorkMode, EmploymentType, ApplicationStatus, Priority } from './types';

// Create job application
export const createJobApplicationSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200),
  roleTitle: z.string().min(1, 'Role title is required').max(200),
  location: z.string().max(200).optional(),
  workMode: z.enum([WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ONSITE]),
  employmentType: z.enum([EmploymentType.FULLTIME, EmploymentType.CONTRACT, EmploymentType.INTERN]),
  status: z.enum([
    ApplicationStatus.WISHLIST,
    ApplicationStatus.APPLIED,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.GHOSTED,
  ]).default(ApplicationStatus.WISHLIST),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).default(Priority.MEDIUM),
  appliedDate: z.string().datetime().optional(),
  nextFollowUpDate: z.string().datetime().optional(),
  salaryTarget: z.number().positive().optional(),
  link: z.string().url().optional().or(z.literal('')),
  notes: z.string().max(5000).optional(),
});

export type CreateJobApplicationInput = z.infer<typeof createJobApplicationSchema>;

// Update job application
export const updateJobApplicationSchema = createJobApplicationSchema.partial();

export type UpdateJobApplicationInput = z.infer<typeof updateJobApplicationSchema>;

// Job application response
export const jobApplicationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  company: z.string(),
  roleTitle: z.string(),
  location: z.string().nullable(),
  workMode: z.enum([WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ONSITE]),
  employmentType: z.enum([EmploymentType.FULLTIME, EmploymentType.CONTRACT, EmploymentType.INTERN]),
  status: z.enum([
    ApplicationStatus.WISHLIST,
    ApplicationStatus.APPLIED,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.GHOSTED,
  ]),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
  appliedDate: z.string().nullable(),
  nextFollowUpDate: z.string().nullable(),
  salaryTarget: z.number().nullable(),
  link: z.string().nullable(),
  notes: z.string().nullable(),
  archived: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type JobApplication = z.infer<typeof jobApplicationSchema>;

// List job applications query
export const listJobApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum([
    ApplicationStatus.WISHLIST,
    ApplicationStatus.APPLIED,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.OFFER,
    ApplicationStatus.REJECTED,
    ApplicationStatus.GHOSTED,
  ]).optional(),
  workMode: z.enum([WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ONSITE]).optional(),
  employmentType: z.enum([EmploymentType.FULLTIME, EmploymentType.CONTRACT, EmploymentType.INTERN]).optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  archived: z.preprocess((val) => {
    // Handle string boolean values from query params
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, z.boolean().optional()),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sortBy: z.enum(['updatedAt', 'createdAt', 'appliedDate', 'company', 'status']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListJobApplicationsQuery = z.infer<typeof listJobApplicationsQuerySchema>;

// Paginated response
export const paginatedJobApplicationsSchema = z.object({
  data: z.array(jobApplicationSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  }),
});

export type PaginatedJobApplications = z.infer<typeof paginatedJobApplicationsSchema>;
