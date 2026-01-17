// Runtime constants for Zod enums and validation

export const USER_ROLES = ['applicant', 'recruiter'] as const;

export const COMPANIES = [
  'GOOGLE',
  'APPLE',
  'MICROSOFT',
  'AMAZON',
  'META',
  'NETFLIX',
  'TESLA',
  'TWITTER',
  'SPOTIFY',
  'ADOBE',
] as const;

export const JOB_POSTING_STATUSES = ['open', 'closed'] as const;

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
  APPLICANT: 'applicant',
  RECRUITER: 'recruiter',
} as const;

export const Company = {
  GOOGLE: 'GOOGLE',
  APPLE: 'APPLE',
  MICROSOFT: 'MICROSOFT',
  AMAZON: 'AMAZON',
  META: 'META',
  NETFLIX: 'NETFLIX',
  TESLA: 'TESLA',
  TWITTER: 'TWITTER',
  SPOTIFY: 'SPOTIFY',
  ADOBE: 'ADOBE',
} as const;

export const JobPostingStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
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
