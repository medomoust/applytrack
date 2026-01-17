import { z } from 'zod';
import type { WorkMode, EmploymentType, ApplicationStatus, Priority } from './types.js';
import { WORK_MODES, EMPLOYMENT_TYPES, APPLICATION_STATUSES, PRIORITIES, ApplicationStatus as ApplicationStatusEnum } from './constants.js';

// Note: Job applications are now created by applying to job postings
// Direct creation is not allowed

// Update job application
export const updateJobApplicationSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  nextFollowUpDate: z.string().datetime().optional(),
  salaryTarget: z.number().positive().optional(),
  notes: z.string().max(5000).optional(),
});

export type UpdateJobApplicationInput = z.infer<typeof updateJobApplicationSchema>;

// Job application response
export const jobApplicationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  jobPostingId: z.string(),
  applicantName: z.string(),
  company: z.string(),
  roleTitle: z.string(),
  location: z.string().nullable(),
  workMode: z.enum(WORK_MODES),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  status: z.enum(APPLICATION_STATUSES),
  priority: z.enum(PRIORITIES),
  appliedDate: z.string(),
  nextFollowUpDate: z.string().nullable(),
  salaryTarget: z.number().nullable(),
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
  status: z.enum(APPLICATION_STATUSES).optional(),
  workMode: z.enum(WORK_MODES).optional(),
  employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
  priority: z.enum(PRIORITIES).optional(),
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
