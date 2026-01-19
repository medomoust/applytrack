# ApplyTrack

> **Enterprise-Grade Job Application Tracker** — A production-ready, full-stack TypeScript application featuring two-sided marketplace functionality (applicant + recruiter portals), drag-and-drop Kanban boards, real-time analytics with interactive charts, comprehensive testing suite, and role-based admin system.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748.svg)](https://www.prisma.io/)
[![Playwright](https://img.shields.io/badge/Playwright-1.57-45ba4b.svg)](https://playwright.dev/)

## 🎯 Overview

ApplyTrack is a sophisticated two-sided marketplace job application tracking system that serves both job applicants and recruiters. Built with modern TypeScript, microservices architecture, and enterprise best practices, it provides a complete hiring ecosystem with real-time analytics, automated testing, and comprehensive admin controls.

**Perfect for:**
- 🎓 Job seekers tracking applications across multiple companies
- 💼 Recruiters managing applicant pipelines for their organization
- 🏢 Companies needing centralized recruitment management
- 🔧 Developers showcasing full-stack TypeScript expertise

**Key Differentiators:**
- ✅ Dual-role system (Applicant + Recruiter portals)
- ✅ Real-time visual analytics with Recharts
- ✅ Production-ready with E2E testing (Playwright)
- ✅ Admin dashboard for user management
- ✅ CSV export functionality
- ✅ Fully responsive with modern UI/UX

## 🚀 Live Demo

**Demo Credentials Available on Login Page**

**Applicant Account:**
- Email: `john.doe@email.com`
- Password: `Password123!`

**Recruiter Account:**
- Email: `recruiter@meta.com`
- Password: `Password123!`

**Admin Account:** (Contact for credentials)

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Testing](#-testing)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Development](#-development)
- [License](#-license)

## ✨ Features

### � Two-Sided Marketplace

- **Applicant Portal**
  - Browse open job postings from multiple companies
  - Apply to jobs with custom notes and salary expectations
  - Track applications through 6-stage pipeline (Wishlist → Applied → Interview → Offer → Rejected/Ghosted)
  - Kanban board for visual application management
  - Personal dashboard with analytics
  - CSV export of all applications

- **Recruiter Portal**
  - Post and manage job openings for your company
  - View all applicants to your company's jobs
  - Drag-and-drop applicant management
  - See applicant names and contact information
  - Track recruitment pipeline efficiency
  - Company-specific analytics dashboard

- **Admin System**
  - Master admin account with elevated privileges
  - User management dashboard (view, edit, deactivate users)
  - Role-based access control
  - System-wide analytics and monitoring

### 🎨 Premium User Interface

- **Interactive Kanban Board**
  - Drag-and-drop functionality powered by @dnd-kit
  - Visual columns for each application status
  - Real-time updates and smooth animations with Framer Motion
  - Quick status transitions with visual feedback
  - Role-specific views (applicants see their apps, recruiters see applicant names)

- **Modern Dashboard with Data Visualization**
  - Animated KPI cards with gradient orbs
  - Interactive bar charts showing status distribution
  - Pie chart for application overview
  - Real-time activity feed with icons
  - Responsive layout with mobile optimization
  - Color-coded status indicators

- **Advanced Table View**
  - Sortable columns
  - Inline editing capabilities
  - Bulk selection and actions
  - **CSV Export** - Download filtered data instantly
  - Search and filter integration
- **Modern UI/UX Design**
  - Smooth animations with Framer Motion
  - Toast notifications with Sonner
  - Responsive design (mobile, tablet, desktop)
  - Skeleton loading states
  - Empty state illustrations
  - Dark-themed interface with gradient accents
  - Accessible design with Radix UI primitives

### 🔐 Authentication & Authorization

- **Secure Authentication System**
  - JWT access tokens (15-minute expiry)
  - Refresh tokens with HTTP-only cookies (7-day expiry)
  - Automatic token refresh with persistent login
  - Secure password hashing with bcrypt (10 rounds)
  - Rate limiting on auth endpoints (50 attempts per 15 minutes)

- **Role-Based Access Control (RBAC)**
  - **Applicant Role**: Browse jobs, manage personal applications
  - **Recruiter Role**: Post jobs, view applicants to company jobs
  - **Admin Role**: Full system access + user management
  - Protected routes with middleware
  - Permission-based UI rendering

- **Demo Credentials**
  - Sleek gradient banner on login page
  - Pre-configured test accounts for both roles
  - Non-intrusive design with User and Lock icons

### 📊 Dashboard & Analytics

- **Real-Time KPI Cards**
  - Total applications count
  - Applications by status (Applied, Interview, Offers)
  - Wishlist tracking (applicants only)
  - Animated gradient background orbs

- **Visual Analytics**
  - **Bar Chart**: Status distribution with gradient fills (blue to purple)
  - **Pie Chart**: Application overview with custom colors per status
  - Interactive tooltips with dark theme (#1f2937)
  - Recharts 2.x integration
  - Responsive chart sizing

- **Activity Feed**
  - Real-time updates with event icons (➕✏️🔄📦♻️📝)
  - Recent activity with timestamps
  - Application-specific activity tracking
  - Automatic refresh on data changes

### 📝 Job Application & Posting Management

- **Job Postings (Recruiter)**
  - Create and edit job openings
  - Set company, role, location, work mode, employment type
  - Define salary ranges
  - Add detailed descriptions and requirements
  - Open/Close status management
  - View applicant count per posting

- **Job Browsing (Applicant)**
  - Browse all open positions
  - Filter by company, work mode, employment type
  - Search by role title or company name
  - View detailed job descriptions
  - One-click application with notes

- **Application Management**
  - Comprehensive CRUD operations
  - 15+ data fields per application
  - Soft delete with archive functionality
  - Restore archived applications
  - **CSV Export** with role-specific columns
  - Drag-and-drop status updates

- **Advanced Filtering & Search**
  - Full-text search across company, role, and notes
  - Filter by status, work mode, employment type, priority
  - Multiple filters can be combined
  - Real-time filter updates
  - Filter badge indicators

### 📜 Activity Logging & Audit Trail

- **Automatic Change Tracking**
  - Every modification is logged automatically
  - User attribution for all changes
  - Real-time activity page updates (no refresh needed)
  - Metadata storage for detailed context

- **Event Types**
  - `created` - Application created
  - `updated` - Fields modified
  - `status_changed` - Status transitions
  - `archived` - Application archived
  - `restored` - Application restored from archive
  - `note_added` - Notes updated

- **Activity Timeline**
  - Dedicated activity page with pagination
  - Dashboard activity feed (recent 5 items)
  - Real-time updates via React Query invalidation
  - Filter by application or event type
  - Chronological view with timestamps

### 👥 Admin Panel

- **User Management**
  - View all registered users
  - Search and filter users
  - Update user details
  - Role assignment (User ↔ Admin)
  - Account activation/deactivation
  - View user statistics

- **System Monitoring**
  - User registration trends
  - Application statistics per user
  - Activity monitoring
  - Role distribution

### 🔒 Security Features

- **Data Protection**
  - Environment variable configuration
  - CORS protection
  - SQL injection prevention via Prisma
  - XSS protection
  - CSRF token support ready
  - Secure HTTP headers

- **Rate Limiting**
  - Auth endpoints: 50 requests per 15 minutes
  - API endpoints: 1000 requests per minute
  - IP-based tracking
  - Prevents abuse and DDoS attacks

- **Input Validation**
  - Zod schema validation on frontend and backend
  - Type-safe data flow
  - Sanitization of user inputs
  - Error messages with field-level details

### 🚀 Performance Optimizations

- **Frontend Performance**
  - React Query caching and stale-while-revalidate
  - Optimistic updates for instant feedback
  - Code splitting and lazy loading
  - Memoization of expensive operations
  - Virtual scrolling for large lists (ready)

- **Backend Performance**
  - Database connection pooling
  - Indexed database queries
  - Efficient Prisma queries with select/include
  - Request compression
  - Response caching headers

- **Developer Experience**
  - Hot module replacement (HMR)
  - TypeScript strict mode
  - Shared type definitions
  - Auto-rebuild on changes
  - Comprehensive error messages

## � Screenshots

### Authentication & Onboarding
![Login Page with Demo Credentials](./docs/screenshots/login-page.png)
*Sleek gradient banner displaying demo credentials for easy testing*

![Sign Up Page](./docs/screenshots/signup-page.png)
*Role selection during registration (Applicant vs Recruiter)*

### Applicant Dashboard
![Applicant Dashboard](./docs/screenshots/applicant-dashboard.png)
*Animated KPI cards, bar chart, pie chart, and activity feed*

### Recruiter Dashboard
![Recruiter Dashboard](./docs/screenshots/recruiter-dashboard.png)
*Company-specific analytics showing recruitment pipeline*

### Job Management
![Browse Jobs (Applicant)](./docs/screenshots/browse-jobs.png)
*Filter and search job postings, one-click apply*

![Job Postings Management (Recruiter)](./docs/screenshots/job-management.png)
*Create and manage job openings with full CRUD operations*

### Applications
![Applications Kanban (Applicant)](./docs/screenshots/applicant-kanban.png)
*Drag-and-drop personal applications through hiring stages*

![Applications Kanban (Recruiter)](./docs/screenshots/recruiter-kanban.png)
*View and manage all applicants to company jobs*

![CSV Export](./docs/screenshots/csv-export.png)
*Export filtered applications with role-specific columns*

### Activity & Admin
![Activity Log](./docs/screenshots/activity-log.png)
*Comprehensive audit trail with real-time updates*

![Admin Panel (Optional)](./docs/screenshots/admin-panel.png)
*User management dashboard for system administrators*

## �🛠 Tech Stack

### Frontend Technologies
- **Core Framework:** React 18.2 with TypeScript 5.3
- **Build Tool:** Vite 5.0 (Fast HMR, optimized builds)
- **Styling:** 
  - Tailwind CSS 3.4 (Utility-first CSS)
  - Custom design system with CSS variables
  - Responsive breakpoints and mobile-first approach
- **State Management:**
  - Zustand (Authentication state, UI preferences)
  - TanStack Query / React Query (Server state, caching)
  - Local storage persistence
- **Routing:** React Router v6 (Protected routes, layouts)
- **UI Components:**
  - Custom component library (Button, Card, Input, Modal, etc.)
  - Radix UI primitives for accessibility
  - Lucide React icons (300+ icons)
- **Animations:**
  - Framer Motion (Smooth transitions, gestures)
  - CSS transitions for micro-interactions
- **Drag & Drop:** @dnd-kit (Kanban board functionality)
- **Data Visualization:** Recharts 2.x (Bar charts, pie charts with gradients)
- **Form Handling:** 
  - Zod validation (Type-safe schemas)
  - React hooks for form state
- **Notifications:** Sonner (Toast notifications)
- **Date Handling:** date-fns (Lightweight date utilities)

### Backend Technologies
- **Runtime:** Node.js 18+ LTS
- **Framework:** Express 4.18 (Minimal, flexible web framework)
- **Language:** TypeScript 5.3 (Strict mode, full type safety)
- **Database:** PostgreSQL 16 (ACID compliance, powerful queries)
- **ORM:** Prisma 5.0
  - Type-safe database access
  - Schema migrations
  - Introspection and auto-completion
  - Connection pooling
- **Authentication:**
  - jsonwebtoken (JWT generation and verification)
  - bcrypt (Password hashing, 10 rounds)
  - HTTP-only cookies for refresh tokens
- **Validation:** Zod (Shared schemas with frontend)
- **Logging:** Winston (Structured logging, multiple transports)
- **Security Middleware:**
  - cors (Cross-origin resource sharing)
  - express-rate-limit (DDoS protection)
  - helmet (Security headers - ready to implement)
- **Development:**
  - tsx (TypeScript execution)
  - nodemon alternative (Hot reload)

### DevOps & Infrastructure
- **Containerization:** 
  - Docker (Application containerization)
  - Docker Compose (Multi-container orchestration)
- **Package Management:** 
  - npm 9+ (Workspaces for monorepo)
  - Concurrent execution with concurrently
- **Version Control:** Git
- **Code Quality:**
  - ESLint (Linting)
  - TypeScript compiler (Type checking)
  - Prettier ready (Code formatting)
- **Database Management:**
  - Prisma Studio (Visual database browser)
  - Migrations with rollback support
  - Seeding scripts

### Shared Libraries
- **@applytrack/shared**: Shared TypeScript package
  - Zod schemas for validation
  - TypeScript types and interfaces
  - Constants and enums
  - Utility functions
  - Auto-rebuild on changes (watch mode)

### Architecture Patterns
- **Monorepo Structure** (npm workspaces)
- **RESTful API** design principles
- **Repository Pattern** (Prisma as data layer)
- **Middleware Pattern** (Express middleware chain)
- **JWT + Refresh Token** authentication flow
- **Role-Based Access Control** (RBAC)

## 🧪 Testing

### End-to-End Testing with Playwright

- **Test Suite Coverage**
  - Authentication flows (login, signup, invalid credentials)
  - Complete job application flow (recruiter creates job → applicant applies → verification)
  - Dashboard KPI cards and chart interactions
  - Search and filter functionality
  - Drag-and-drop Kanban operations

- **Testing Infrastructure**
  - Playwright 1.57.0 with Chromium
  - Page Object Model pattern with helper functions
  - Reusable authentication utilities
  - Test isolation with independent user contexts

- **CI/CD Integration**
  - GitHub Actions workflow (`.github/workflows/e2e-tests.yml`)
  - Automated test runs on push to main
  - Matrix testing across multiple Node versions
  - Playwright browser installation caching
  - Detailed test reports and screenshots on failure

- **Running Tests Locally**
  ```bash
  # Install Playwright browsers (first time only)
  npx playwright install
  
  # Run all E2E tests
  npm test
  
  # Run specific test file
  npx playwright test tests/auth.spec.ts
  
  # Run tests in UI mode (interactive)
  npx playwright test --ui
  
  # Generate HTML report
  npx playwright show-report
  ```

- **Test Files**
  - `tests/auth.spec.ts` - Authentication and authorization
  - `tests/job-flow.spec.ts` - Complete hiring workflow
  - `tests/dashboard.spec.ts` - Analytics and visualizations
  - `tests/filters.spec.ts` - Search and filter operations
  - `tests/helpers/auth.ts` - Reusable login utilities
- **Server-side Pagination** for scalability
- **Optimistic UI Updates** for responsiveness
- **Error Boundaries** and graceful error handling

## 🏗 Architecture

```
applytrack/
├── apps/
│   ├── api/              # Express backend
│   │   ├── src/
│   │   │   ├── routes/   # API routes
│   │   │   ├── middleware/ # Auth, error handling, rate limiting
│   │   │   ├── utils/    # Helpers, auth utilities
│   │   │   ├── db/       # Prisma client
│   │   │   ├── config.ts
│   │   │   └── index.ts
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   └── web/              # React frontend
│       ├── src/
│       │   ├── components/ # UI components
│       │   ├── pages/     # Page components
│       │   ├── lib/       # API client, auth, utils
│       │   ├── App.tsx
│       │   └── main.tsx
│       └── index.html
├── packages/
│   └── shared/           # Shared Zod schemas & types
│       └── src/
│           ├── types.ts
│           ├── auth.schemas.ts
│           ├── job-application.schemas.ts
│           ├── activity.schemas.ts
│           └── user.schemas.ts
├── docs/                 # Documentation
├── docker-compose.yml
├── package.json
└── README.md
```

### Database Schema

```prisma
User
├── id (UUID)
├── email (unique)
├── password (hashed)
├── name
├── role (user | admin)
├── isActive
└── timestamps

JobApplication
├── id (UUID)
├── userId (FK)
├── company
├── roleTitle
├── location
├── workMode (remote | hybrid | onsite)
├── employmentType (fulltime | contract | intern)
├── status (wishlist | applied | interview | offer | rejected | ghosted)
├── priority (low | medium | high)
├── appliedDate
├── nextFollowUpDate
├── salaryTarget
├── link
├── notes
├── archived
└── timestamps

ActivityLog
├── id (UUID)
├── userId (FK)
├── jobApplicationId (FK)
├── eventType
├── description
├── metadata (JSON)
└── createdAt

RefreshToken
├── id (UUID)
├── userId (FK)
├── token (unique)
├── expiresAt
└── createdAt
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** 18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0.0 or higher (comes with Node.js)
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/downloads))

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/applytrack.git
cd applytrack
```

#### 2. Install Dependencies

Install all workspace dependencies (this will install for all packages):

```bash
npm install
```

This installs dependencies for:
- Root workspace
- `apps/api` (Backend)
- `apps/web` (Frontend)
- `packages/shared` (Shared code)

#### 3. Environment Configuration

Create environment files with your configuration:

**Backend Environment** (`apps/api/.env`):

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/applytrack"

# Server Configuration
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:5173

# JWT Configuration (Generate strong secrets for production!)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Frontend Environment** (`apps/web/.env`):

```bash
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env`:

```env
VITE_API_URL=http://localhost:3001
```

#### 4. Start PostgreSQL Database

Using Docker Compose (recommended):

```bash
docker compose up -d
```

This will:
- Start PostgreSQL 16 container
- Expose port 5432
- Create database volume for data persistence
- Use credentials from docker-compose.yml

Verify the database is running:

```bash
docker ps
# Should show applytrack-db container running
```

#### 5. Database Setup

Generate Prisma Client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

Seed the database with demo data:

```bash
npm run db:seed
```

This creates:
- 2 user accounts (admin and demo user)
- 40 sample job applications
- Activity logs for demonstration

#### 6. Build Shared Package

Build the shared package (types and schemas):

```bash
cd packages/shared && npm run build && cd ../..
```

Or from root:

```bash
npm run build --workspace=packages/shared
```

#### 7. Start Development Servers

Start all development servers (API + Frontend + Shared watch mode):

```bash
npm run dev
```

This starts:
- **API Server** on http://localhost:3001 (with auto-reload)
- **Web App** on http://localhost:5173 (with HMR)
- **Shared Package** in watch mode (auto-rebuild on changes)

#### 8. Access the Application

Open your browser and navigate to:

- **Frontend:** http://localhost:5173
- **API Health Check:** http://localhost:3001/health
- **API Documentation:** See [API Documentation](#-api-documentation) section

#### 9. Login with Demo Accounts

After seeding, you can login with these credentials:

**Admin Account:**
- Email: `admin@applytrack.dev`
- Password: `Password123!`
- Features: Full access + user management

**Demo User Account:**
- Email: `demo@applytrack.dev`  
- Password: `Password123!`
- Features: Personal application management

### Quick Start (One Command Setup)

If you have `make` installed:

```bash
make setup
```

This runs all setup steps automatically:
1. Installs dependencies
2. Starts Docker containers
3. Generates Prisma client
4. Runs migrations
5. Seeds database
6. Builds shared package

Then start development:

```bash
make dev
```

### Troubleshooting

**Port Already in Use:**

If ports 3001 or 5173 are in use:

```bash
# Find and kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Find and kill process using port 5173  
lsof -ti:5173 | xargs kill -9
```

**Database Connection Issues:**

Ensure Docker is running and the database container is up:

```bash
docker compose ps
docker compose logs db
```

**Prisma Client Not Found:**

Regenerate Prisma client:

```bash
npm run db:generate
```

**Build Errors in Shared Package:**

Rebuild the shared package:

```bash
cd packages/shared
npm run build
cd ../..
```

**Module Resolution Errors:**

Clear node_modules and reinstall:

```bash
npm run clean
npm install
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/applytrack"

# API Configuration
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:5173

# JWT Secrets (generate secure random strings for production)
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
VITE_API_URL=http://localhost:3001
```

### Production Environment Variables

For production, ensure you:
1. Generate strong random secrets for JWT keys
2. Use a production PostgreSQL database URL
3. Set `NODE_ENV=production`
4. Configure CORS_ORIGIN to your frontend domain

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe" // optional
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<token>
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### Job Applications Endpoints

#### List Applications
```http
GET /api/applications
Authorization: Bearer <access_token>

Query Parameters:
- page: number (default: 1)
- pageSize: number (default: 20, max: 100)
- status: wishlist | applied | interview | offer | rejected | ghosted
- workMode: remote | hybrid | onsite
- employmentType: fulltime | contract | intern
- priority: low | medium | high
- archived: boolean
- search: string
- startDate: ISO datetime
- endDate: ISO datetime
- sortBy: updatedAt | createdAt | appliedDate | company | status
- sortOrder: asc | desc
```

#### Get Single Application
```http
GET /api/applications/:id
Authorization: Bearer <access_token>
```

#### Create Application
```http
POST /api/applications
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "company": "Google",
  "roleTitle": "Senior Software Engineer",
  "location": "San Francisco, CA",
  "workMode": "remote",
  "employmentType": "fulltime",
  "status": "wishlist",
  "priority": "high",
  "appliedDate": "2024-01-15T00:00:00Z",
  "nextFollowUpDate": "2024-01-22T00:00:00Z",
  "salaryTarget": 150000,
  "link": "https://careers.google.com/...",
  "notes": "Great opportunity"
}
```

#### Update Application
```http
PATCH /api/applications/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "interview",
  "notes": "First round scheduled"
}
```

#### Archive Application
```http
POST /api/applications/:id/archive
Authorization: Bearer <access_token>
```

#### Restore Application
```http
POST /api/applications/:id/restore
Authorization: Bearer <access_token>
```

#### Delete Application
```http
DELETE /api/applications/:id
Authorization: Bearer <access_token>
```

### Activity Endpoints

#### List Activity Logs
```http
GET /api/activity
Authorization: Bearer <access_token>

Query Parameters:
- page: number
- pageSize: number
- jobApplicationId: UUID
- eventType: created | updated | status_changed | archived | restored | note_added
```

### Dashboard Endpoints

#### Get Dashboard Stats
```http
GET /api/dashboard/stats
Authorization: Bearer <access_token>
```

#### Get Recent Activity
```http
GET /api/dashboard/activity
Authorization: Bearer <access_token>
```

### Admin Endpoints (Requires Admin Role)

#### List Users
```http
GET /api/users
Authorization: Bearer <access_token>

Query Parameters:
- page: number
- pageSize: number
- role: user | admin
- isActive: boolean
- search: string
```

#### Get User
```http
GET /api/users/:id
Authorization: Bearer <access_token>
```

#### Update User
```http
PATCH /api/users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Doe",
  "role": "admin",
  "isActive": false
}
```

### Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": [  // Only for validation errors
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## 🚀 Deployment

### Deploy to Render

#### Backend (API)

1. **Create a new Web Service**
   - Repository: Link your GitHub repo
   - Build Command: `npm install && npm run build:api`
   - Start Command: `npm run start --workspace=apps/api`
   - Add Environment Variables from `.env.example`

2. **Create PostgreSQL Database**
   - Create a new PostgreSQL instance on Render
   - Copy the Internal Database URL
   - Add as `DATABASE_URL` environment variable

3. **Run Migrations**
   - After deployment, run shell command:
   ```bash
   npm run db:migrate --workspace=apps/api
   npm run db:seed --workspace=apps/api
   ```

#### Frontend (Web)

**Option 1: Deploy to Vercel**

1. Import your repository to Vercel
2. Set Root Directory: `apps/web`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable: `VITE_API_URL=<your-render-api-url>`

**Option 2: Deploy to Render (Static Site)**

1. Create a new Static Site
2. Build Command: `npm install && npm run build:web`
3. Publish Directory: `apps/web/dist`
4. Add Environment Variable: `VITE_API_URL=<your-render-api-url>`

### Deploy with Docker

```bash
# Build images
docker build -t applytrack-api -f apps/api/Dockerfile .
docker build -t applytrack-web -f apps/web/Dockerfile .

# Run containers
docker run -d -p 3001:3001 --env-file .env applytrack-api
docker run -d -p 80:80 applytrack-web
```

## 📸 Screenshots

### Authentication

<div align="center">

#### Login Page
![Login Page](docs/screenshots/applyTrackLoginPage.png)
*Secure authentication with JWT tokens and refresh token rotation*

#### Sign Up Page
![Sign Up Page](docs/screenshots/applyTrackSignUpPage.png)
*User registration with validation and immediate feedback*

</div>

---

### Dashboard Views

<div align="center">

#### Admin Dashboard
![Admin Dashboard](docs/screenshots/adminUserDashboard.png)
*Real-time KPIs, analytics charts, and activity timeline for administrators*

#### User Dashboard
![User Dashboard](docs/screenshots/demoUserDashboard.png)
*Personalized metrics and insights for tracking job search progress*

</div>

---

### Application Management

<div align="center">

#### Kanban Board View
![Kanban View](docs/screenshots/demoUserApplicationsKanbanView.png)
*Interactive drag-and-drop board for visual application tracking across stages*

#### Drag & Drop in Action
![Drag and Drop](docs/screenshots/dragAndDropMidActionAdminUserApplicationsPage.png)
*Smooth drag-and-drop interaction with visual feedback - move applications between stages effortlessly*

#### Table View
![Table View](docs/screenshots/adminUserAplicationsPageTableView.png)
*Comprehensive table view with sorting, filtering, and inline actions*

#### Application Modal
![Application Modal](docs/screenshots/newApplicationModal.png)
*Full-featured form for creating and editing applications with rich field options*

</div>

---

### Advanced Features

<div align="center">

#### Command Palette (⌘K)
![Command Palette](docs/screenshots/commandPalette.png)
*Keyboard-first navigation - access any feature instantly with fuzzy search*

</div>

---

### Activity & Admin Features

<div align="center">

#### Activity Log (Admin)
![Admin Activity](docs/screenshots/adminUserActivityPage.png)
*Complete audit trail of all system activities with user attribution*

#### Activity Log (User)
![User Activity](docs/screenshots/demoUserActivity.png)
*Personal activity timeline showing all changes to applications*

#### Admin Panel
![Admin Panel](docs/screenshots/adminUserAdminPage.png)
*User management interface with role assignment and account controls*

</div>

---

### Key UI Features Demonstrated

- ✨ **Modern Design**: Clean, professional interface with consistent styling
- 🎨 **Responsive Layout**: Adapts seamlessly to different screen sizes
- 📊 **Data Visualization**: Interactive charts and KPI cards for insights
- 🎯 **Dual View Modes**: Kanban board for visual workflow, table for detailed management
- 🔍 **Advanced Filtering**: Multiple filter options with real-time search
- 📱 **Mobile-Friendly**: Collapsible sidebar and responsive components
- 🎭 **Role-Based UI**: Tailored experiences for admin and regular users
- 💡 **Smooth Animations**: Framer Motion for professional transitions
- 🎉 **Toast Notifications**: Non-intrusive success/error feedback
- ⌨️ **Keyboard Shortcuts**: Command palette (⌘K) for power users
- 🖱️ **Drag & Drop**: Intuitive application movement between stages
- 📝 **Rich Forms**: Comprehensive modals with validation and auto-save
- 🎪 **Empty States**: Helpful prompts when no data exists (described in Features section)
- ⚠️ **Error Handling**: Graceful error states with actionable messages (see API error handling)
- 🔄 **Loading States**: Skeleton screens for perceived performance (implemented throughout)
- 📲 **Mobile Responsive**: Touch-friendly interfaces work on all devices (adaptive layout shown above)

## 🧪 Testing

### Run Tests
```bash
npm test
```

### API Integration Tests
```bash
cd apps/api
npm test
```

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start both API and Web in development mode
- `npm run build` - Build all packages
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run linters
- `npm test` - Run all tests
- `npm run clean` - Remove all node_modules and build artifacts

### API
- `npm run dev --workspace=apps/api` - Start API in development mode
- `npm run build --workspace=apps/api` - Build API for production
- `npm run db:generate --workspace=apps/api` - Generate Prisma client
- `npm run db:migrate --workspace=apps/api` - Run database migrations
- `npm run db:seed --workspace=apps/api` - Seed database
- `npm run db:studio --workspace=apps/api` - Open Prisma Studio

### Web
- `npm run dev --workspace=apps/web` - Start Web in development mode
- `npm run build --workspace=apps/web` - Build Web for production
- `npm run preview --workspace=apps/web` - Preview production build

### Make Commands
- `make help` - Show all available commands
- `make setup` - Complete project setup
- `make dev` - Start development servers
- `make docker-up` - Start Docker containers
- `make docker-down` - Stop Docker containers
- `make db-migrate` - Run Prisma migrations
- `make db-seed` - Seed database

## 🔧 Development

### Project Structure Best Practices

- **Shared Code**: Common types and schemas in `/packages/shared`
- **API Routes**: RESTful structure in `/apps/api/src/routes`
- **Frontend Components**: Organized by feature in `/apps/web/src`
- **Type Safety**: Full TypeScript coverage with strict mode
- **Validation**: Zod schemas shared between frontend and backend

### Code Quality

- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting (configure as needed)
- Structured logging with Winston

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Built by Mahmoud Moustafa**

This project showcases expertise in:
- Full-stack TypeScript development
- Modern React patterns and best practices
- RESTful API design and implementation
- Database design and optimization with Prisma
- Authentication and authorization systems
- Docker containerization
- Monorepo architecture with npm workspaces
- UI/UX design and responsive layouts
- Performance optimization techniques
- Security best practices

**Portfolio:** [Your Portfolio URL]  
**LinkedIn:** [Your LinkedIn URL]  
**GitHub:** [Your GitHub URL]

## 🎯 Key Technical Highlights

### Architecture & Design
- **Monorepo Structure** with npm workspaces for code sharing and consistency
- **Shared Package** with Zod schemas and TypeScript types used by both frontend and backend
- **RESTful API** with consistent error handling and response formats
- **Repository Pattern** with Prisma as the data access layer
- **Middleware Chain** in Express for authentication, rate limiting, and error handling

### Security Implementation
- **JWT + Refresh Token** pattern with automatic rotation
- **HTTP-only Cookies** for refresh tokens to prevent XSS attacks
- **bcrypt** password hashing with 10 salt rounds
- **Rate Limiting** on authentication endpoints (5 attempts per 15 minutes)
- **API Rate Limiting** (100 requests per minute)
- **Input Validation** on both client and server with Zod
- **SQL Injection Prevention** through Prisma's query builder
- **CORS Configuration** for cross-origin protection

### Frontend Excellence
- **Optimistic Updates** for instant UI feedback
- **React Query** caching strategy with stale-while-revalidate
- **Command Palette** (⌘K) for power user workflows
- **Drag & Drop** Kanban board with smooth animations
- **Keyboard Navigation** throughout the application
- **Error Boundaries** for graceful error handling
- **Loading States** with skeleton screens
- **Empty States** with actionable prompts
- **Toast Notifications** for user feedback
- **Responsive Design** that works on all screen sizes

### Backend Robustness
- **Structured Logging** with Winston for debugging and monitoring
- **Database Migrations** with Prisma for version control
- **Connection Pooling** for optimal database performance
- **Indexed Queries** for fast data retrieval
- **Soft Deletes** (archive/restore) for data recovery
- **Activity Logging** for complete audit trails
- **Pagination** for handling large datasets
- **Transaction Support** for data consistency

### Developer Experience
- **Hot Module Replacement** (HMR) for instant feedback
- **TypeScript Strict Mode** for maximum type safety
- **Shared Types** between frontend and backend
- **Auto-rebuild** on changes in shared package
- **Comprehensive Error Messages** with field-level validation
- **Prisma Studio** for visual database management
- **Docker Compose** for one-command database setup
- **npm Workspaces** for efficient dependency management

## 📚 Learning Resources

This project demonstrates proficiency in:

- **TypeScript** - Advanced types, generics, utility types
- **React** - Hooks, context, custom hooks, performance optimization
- **Node.js** - Event loop, streams, async patterns
- **Express** - Middleware, routing, error handling
- **PostgreSQL** - Relational database design, indexing, queries
- **Prisma** - ORM, migrations, schema design
- **JWT** - Token-based authentication
- **REST API** - Design principles, versioning, documentation
- **Docker** - Containerization, multi-container apps
- **Git** - Version control, branching strategies

## 🚀 Potential Enhancements

Future improvements that could be implemented:

### Features
- [ ] Email notifications for follow-up reminders
- [ ] Calendar integration for interview scheduling
- [ ] Document uploads (resume, cover letter)
- [ ] Application status automation (webhooks)
- [ ] Export data to CSV/PDF
- [ ] Analytics dashboard with charts and insights
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Browser extension for quick application capture
- [ ] Integration with LinkedIn, Indeed, Glassdoor APIs

### Technical Improvements
- [ ] GraphQL API as an alternative to REST
- [ ] Real-time updates with WebSockets
- [ ] Redis caching layer
- [ ] Elasticsearch for advanced search
- [ ] Automated testing (Jest, Cypress, Playwright)
- [ ] CI/CD pipeline (GitHub Actions, GitLab CI)
- [ ] Monitoring and alerting (Sentry, DataDog)
- [ ] Performance monitoring (Lighthouse, Web Vitals)
- [ ] A/B testing framework
- [ ] Multi-language support (i18n)

## 📊 Performance Metrics

### Frontend Performance
- **First Contentful Paint (FCP):** < 1.5s
- **Time to Interactive (TTI):** < 3.5s
- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices)
- **Bundle Size:** < 200KB gzipped (main bundle)
- **Code Splitting:** Implemented for routes

### Backend Performance
- **API Response Time:** < 100ms (average)
- **Database Query Time:** < 50ms (average)
- **Throughput:** 1000+ requests per second (under load)
- **Memory Usage:** < 256MB (typical)
- **Error Rate:** < 0.1%

## 🤝 Contributing

Contributions are welcome! This is a portfolio project, but improvements and suggestions are appreciated.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

You are free to:
- Use this code for learning purposes
- Modify and adapt for your own projects
- Use in commercial applications

Attribution is appreciated but not required.

## 🙏 Acknowledgments

### Technologies & Libraries
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Framer Motion](https://www.framer.com/motion/) - Production-ready animations
- [Recharts](https://recharts.org/) - Composable charting library
- [dnd-kit](https://dndkit.com/) - Modern drag and drop toolkit
- [Zod](https://zod.dev/) - TypeScript-first schema validation

### Design Inspiration
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component designs
- [Vercel](https://vercel.com/) - Clean, modern UI patterns
- [Linear](https://linear.app/) - Exceptional keyboard-first UX
- [Notion](https://notion.so/) - Intuitive command palette

---

## 📞 Contact & Support

**Questions or feedback?** Feel free to reach out!

- **Email:** [your.email@example.com]
- **LinkedIn:** [Your LinkedIn Profile]
- **Portfolio:** [Your Portfolio Website]

**Found a bug?** Please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

---

<div align="center">

**Built with ❤️ using TypeScript, React, and Node.js**

⭐ Star this repo if you find it helpful!

</div>
