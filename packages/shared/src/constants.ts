// Runtime constants for Zod enums and validation

export const USER_ROLES = ['user', 'admin'] as const;

export const WORK_MODES = ['remote', 'hybrid', 'onsite'] as const;

export const EMPLOYMENT_TYPES = ['fulltime', 'contract', 'intern'] as const;

export const APPLICATION_STATUSES = [
  'wishlist',
  'applied',
  'interview',
  'offer',
  'rejected',
  'ghosted',
] as const;

export const PRIORITIES = ['low', 'medium', 'high'] as const;

export const ACTIVITY_EVENT_TYPES = [
  'created',
  'updated',
  'status_changed',
  'archived',
  'restored',
  'note_added',
] as const;

// Runtime enum objects for convenient access
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
