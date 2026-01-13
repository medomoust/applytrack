import { z } from 'zod';

// Enums
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const WorkMode = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite',
} as const;

export const EmploymentType = {
  FULLTIME: 'fulltime',
  CONTRACT: 'contract',
  INTERN: 'intern',
} as const;

export const ApplicationStatus = {
  WISHLIST: 'wishlist',
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  GHOSTED: 'ghosted',
} as const;

export const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const ActivityEventType = {
  CREATED: 'created',
  UPDATED: 'updated',
  STATUS_CHANGED: 'status_changed',
  ARCHIVED: 'archived',
  RESTORED: 'restored',
  NOTE_ADDED: 'note_added',
} as const;

// Type exports
export type UserRole = typeof UserRole[keyof typeof UserRole];
export type WorkMode = typeof WorkMode[keyof typeof WorkMode];
export type EmploymentType = typeof EmploymentType[keyof typeof EmploymentType];
export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];
export type Priority = typeof Priority[keyof typeof Priority];
export type ActivityEventType = typeof ActivityEventType[keyof typeof ActivityEventType];
