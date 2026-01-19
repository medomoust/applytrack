import { z } from 'zod';
import type { UserRole } from './types.js';
import { USER_ROLES, COMPANIES } from './constants.js';

// Sign up
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(USER_ROLES),
  company: z.enum(COMPANIES).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// Login
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// User response
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.enum(USER_ROLES),
  company: z.enum(COMPANIES).nullable(),
  resumeUrl: z.string().nullable().optional(),
  isActive: z.boolean(),
  isAdmin: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Auth response
export const authResponseSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
