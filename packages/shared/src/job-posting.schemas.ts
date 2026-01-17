import { z } from 'zod';
import type { Company, WorkMode, EmploymentType, JobPostingStatus } from './types.js';
import { COMPANIES, WORK_MODES, EMPLOYMENT_TYPES, JOB_POSTING_STATUSES, JobPostingStatus as JobPostingStatusEnum } from './constants.js';

// Create job posting
export const createJobPostingSchema = z.object({
  company: z.enum(COMPANIES),
  roleTitle: z.string().min(1, 'Role title is required').max(200),
  location: z.string().max(200).optional(),
  workMode: z.enum(WORK_MODES),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  description: z.string().max(5000).optional(),
  requirements: z.string().max(5000).optional(),
  salaryRange: z.string().max(100).optional(),
});

export type CreateJobPostingInput = z.infer<typeof createJobPostingSchema>;

// Update job posting
export const updateJobPostingSchema = createJobPostingSchema.partial().extend({
  status: z.enum(JOB_POSTING_STATUSES).optional(),
});

export type UpdateJobPostingInput = z.infer<typeof updateJobPostingSchema>;

// Job posting response
export const jobPostingSchema = z.object({
  id: z.string(),
  recruiterId: z.string(),
  company: z.enum(COMPANIES),
  roleTitle: z.string(),
  location: z.string().nullable(),
  workMode: z.enum(WORK_MODES),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  description: z.string().nullable(),
  requirements: z.string().nullable(),
  salaryRange: z.string().nullable(),
  status: z.enum(JOB_POSTING_STATUSES),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type JobPosting = z.infer<typeof jobPostingSchema>;

// List job postings query
export const listJobPostingsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  company: z.enum(COMPANIES).optional(),
  workMode: z.enum(WORK_MODES).optional(),
  employmentType: z.enum(EMPLOYMENT_TYPES).optional(),
  status: z.enum(JOB_POSTING_STATUSES).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'company', 'roleTitle']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ListJobPostingsQuery = z.infer<typeof listJobPostingsQuerySchema>;

// Paginated response
export const paginatedJobPostingsSchema = z.object({
  data: z.array(jobPostingSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  }),
});

export type PaginatedJobPostings = z.infer<typeof paginatedJobPostingsSchema>;

// Apply to job posting
export const applyToJobPostingSchema = z.object({
  notes: z.string().max(5000).optional(),
  salaryTarget: z.number().positive().optional(),
});

export type ApplyToJobPostingInput = z.infer<typeof applyToJobPostingSchema>;
