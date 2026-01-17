// Type definitions only - no runtime code

export type UserRole = 'applicant' | 'recruiter';

export type Company = 
  | 'GOOGLE'
  | 'APPLE'
  | 'MICROSOFT'
  | 'AMAZON'
  | 'META'
  | 'NETFLIX'
  | 'TESLA'
  | 'TWITTER'
  | 'SPOTIFY'
  | 'ADOBE';

export type JobPostingStatus = 'open' | 'closed';

export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type EmploymentType = 'fulltime' | 'contract' | 'intern';

export type ApplicationStatus = 
  | 'wishlist'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'ghosted';

export type Priority = 'low' | 'medium' | 'high';

export type ActivityEventType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'archived'
  | 'restored'
  | 'note_added';
