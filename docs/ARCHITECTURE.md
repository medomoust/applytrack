# ApplyTrack Architecture Documentation

## System Overview

ApplyTrack is a monorepo-based full-stack application following modern web development practices. The system is divided into three main packages:

1. **API** (`/apps/api`) - Express-based REST API
2. **Web** (`/apps/web`) - React-based frontend
3. **Shared** (`/packages/shared`) - Common types and validation schemas

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   React App (Vite)                                     │ │
│  │   - Components (UI)                                    │ │
│  │   - Pages (Routes)                                     │ │
│  │   - State Management (Zustand)                        │ │
│  │   - Data Fetching (TanStack Query)                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   Express Server                                       │ │
│  │   - Middleware (Auth, CORS, Rate Limiting)            │ │
│  │   - Routes (RESTful Endpoints)                        │ │
│  │   - Error Handling                                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   PostgreSQL Database                                  │ │
│  │   - Users                                              │ │
│  │   - JobApplications                                    │ │
│  │   - ActivityLogs                                       │ │
│  │   - RefreshTokens                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                 ┌──────────┐                 ┌──────────┐
│  Client  │                 │   API    │                 │    DB    │
└────┬─────┘                 └────┬─────┘                 └────┬─────┘
     │                            │                            │
     │ 1. POST /auth/login        │                            │
     │ {email, password}          │                            │
     ├───────────────────────────►│                            │
     │                            │                            │
     │                            │ 2. Find user & verify      │
     │                            ├───────────────────────────►│
     │                            │                            │
     │                            │◄───────────────────────────┤
     │                            │ 3. User found              │
     │                            │                            │
     │                            │ 4. Generate tokens         │
     │                            │    - Access Token (JWT)    │
     │                            │    - Refresh Token         │
     │                            │                            │
     │                            │ 5. Store refresh token     │
     │                            ├───────────────────────────►│
     │                            │                            │
     │ 6. Return tokens           │                            │
     │    Set-Cookie: refreshToken│                            │
     │◄───────────────────────────┤                            │
     │                            │                            │
     │ 7. Store access token      │                            │
     │    in memory               │                            │
     │                            │                            │
     │ 8. API requests            │                            │
     │ Authorization: Bearer      │                            │
     ├───────────────────────────►│                            │
     │                            │ 9. Verify token            │
     │                            │                            │
     │◄───────────────────────────┤                            │
     │ 10. Response               │                            │
```

## Request Flow

### Standard API Request

```
1. Client makes request with access token
   ↓
2. Express middleware chain:
   - CORS middleware
   - JSON body parser
   - Cookie parser
   - Request logger
   ↓
3. Route-specific middleware:
   - authenticate() - Verifies JWT
   - requireRole() - Checks user role
   - apiLimiter - Rate limiting
   ↓
4. Route handler:
   - Validates input with Zod
   - Business logic
   - Database operations via Prisma
   ↓
5. Response sent to client
   ↓
6. Error handling (if error occurs):
   - errorHandler middleware
   - Structured error response
```

## Data Models

### User
- Core authentication entity
- Has many JobApplications
- Has many ActivityLogs
- Role-based access (user, admin)

### JobApplication
- Main domain entity
- Belongs to User
- Has many ActivityLogs
- Supports soft delete (archived flag)

### ActivityLog
- Audit trail for all changes
- Belongs to User
- Optionally linked to JobApplication
- Immutable (create-only)

### RefreshToken
- JWT refresh token storage
- Belongs to User
- Enables token rotation
- Has expiration date

## Security Measures

1. **Authentication**
   - JWT access tokens (short-lived: 15 minutes)
   - Refresh tokens (long-lived: 7 days, stored in database)
   - HTTP-only cookies for refresh tokens
   - bcrypt password hashing (10 rounds)

2. **Authorization**
   - Role-based access control (RBAC)
   - Middleware guards on protected routes
   - User can only access their own data
   - Admin can manage all users

3. **API Protection**
   - Rate limiting (100 req/min for API, 5 req/15min for auth)
   - CORS configuration
   - Input validation with Zod
   - SQL injection prevention via Prisma

4. **Best Practices**
   - Environment variable configuration
   - Secure password requirements
   - Token rotation on refresh
   - Structured error messages (no sensitive data leaks)

## Frontend Architecture

### State Management
- **Auth State**: Zustand with persistence
- **Theme State**: Zustand with persistence
- **Server State**: TanStack Query with caching

### Component Structure
```
components/
├── ui/              # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── layout/          # Layout components
│   ├── ProtectedLayout.tsx
│   ├── Sidebar.tsx
│   └── Header.tsx
└── applications/    # Feature-specific components
    └── ApplicationModal.tsx
```

### Routing
- React Router v6 with nested routes
- Protected routes with authentication check
- Role-based route guards

## API Endpoints Summary

### Public Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Protected Endpoints
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout
- `GET /api/applications` - List applications (with filters)
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Get application
- `PATCH /api/applications/:id` - Update application
- `POST /api/applications/:id/archive` - Archive application
- `POST /api/applications/:id/restore` - Restore application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/activity` - Activity logs
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/activity` - Recent activity

### Admin Endpoints
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user

## Database Indexes

Optimized queries with strategic indexes:

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);

-- JobApplication indexes
CREATE INDEX idx_job_applications_user_id ON job_applications(userId);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_archived ON job_applications(archived);
CREATE INDEX idx_job_applications_updated_at ON job_applications(updatedAt);

-- ActivityLog indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(userId);
CREATE INDEX idx_activity_logs_job_application_id ON activity_logs(jobApplicationId);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(createdAt);

-- RefreshToken indexes
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(userId);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

## Performance Considerations

1. **Database**
   - Proper indexing on frequently queried fields
   - Connection pooling via Prisma
   - Pagination on large datasets

2. **API**
   - Rate limiting to prevent abuse
   - Efficient queries with selective field retrieval
   - Caching headers for static resources

3. **Frontend**
   - Code splitting with React lazy loading
   - TanStack Query caching (5-minute stale time)
   - Optimistic updates for better UX
   - Debounced search inputs

## Deployment Considerations

### Environment-Specific Configs

**Development**
- Hot reload enabled
- Detailed error messages
- Debug logging
- No rate limiting on auth

**Production**
- Minified bundles
- Generic error messages
- Info-level logging
- Strict rate limiting
- HTTPS only
- Secure cookie flags

### Scaling Strategies

1. **Horizontal Scaling**
   - Stateless API design
   - Refresh tokens in database (shared state)
   - Load balancer ready

2. **Database Scaling**
   - Read replicas for queries
   - Connection pooling
   - Query optimization

3. **Caching**
   - Redis for session storage (future enhancement)
   - CDN for static assets
   - Browser caching for API responses

## Monitoring & Logging

- **API Logs**: Winston with JSON format
- **Request Logging**: Every HTTP request logged
- **Error Tracking**: Structured error logs with stack traces
- **Metrics**: Ready for integration with monitoring tools

## Future Enhancements

1. **Features**
   - Email notifications
   - File uploads (resume, cover letter)
   - Calendar integration
   - Advanced analytics

2. **Technical**
   - GraphQL API option
   - Real-time updates with WebSockets
   - Redis caching layer
   - Automated testing (unit, integration, e2e)
   - CI/CD pipeline
   - Docker production images

3. **Security**
   - Two-factor authentication
   - OAuth providers (Google, GitHub)
   - API key management
   - Audit log viewer
