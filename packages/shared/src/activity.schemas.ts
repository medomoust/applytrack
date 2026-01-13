import { z } from 'zod';
import type { ActivityEventType } from './types.js';
import { ACTIVITY_EVENT_TYPES } from './constants.js';

// Activity log response
export const activityLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  jobApplicationId: z.string().nullable(),
  eventType: z.enum(ACTIVITY_EVENT_TYPES),
  description: z.string(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.string(),
});

export type ActivityLog = z.infer<typeof activityLogSchema>;

// List activity logs query
export const listActivityLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  jobApplicationId: z.string().uuid().optional(),
  eventType: z.enum(ACTIVITY_EVENT_TYPES).optional(),
});

export type ListActivityLogsQuery = z.infer<typeof listActivityLogsQuerySchema>;

// Paginated response
export const paginatedActivityLogsSchema = z.object({
  data: z.array(activityLogSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  }),
});

export type PaginatedActivityLogs = z.infer<typeof paginatedActivityLogsSchema>;
