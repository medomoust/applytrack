import { z } from 'zod';
import type { UserRole } from './types.js';
import { USER_ROLES } from './constants.js';

// Update user (admin only)
export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(USER_ROLES).optional(),
  isActive: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// List users query
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  role: z.enum(USER_ROLES).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
