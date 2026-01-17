-- CreateEnum
CREATE TYPE "Company" AS ENUM ('GOOGLE', 'APPLE', 'MICROSOFT', 'AMAZON', 'META', 'NETFLIX', 'TESLA', 'TWITTER', 'SPOTIFY', 'ADOBE');

-- CreateEnum
CREATE TYPE "JobPostingStatus" AS ENUM ('open', 'closed');

-- AlterEnum: Change UserRole from (admin, user) to (recruiter, applicant)
-- First create new enum
CREATE TYPE "UserRole_new" AS ENUM ('recruiter', 'applicant');

-- Update existing data: admin -> recruiter, user -> applicant
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" 
  USING CASE 
    WHEN "role"::text = 'admin' THEN 'recruiter'::UserRole_new
    WHEN "role"::text = 'user' THEN 'applicant'::UserRole_new
    ELSE 'applicant'::UserRole_new
  END;

-- Drop old enum and rename new one
DROP TYPE "UserRole";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";

-- AlterTable: Add company field to users
ALTER TABLE "users" ADD COLUMN "company" "Company";

-- CreateTable: job_postings
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "company" "Company" NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "location" TEXT,
    "workMode" "WorkMode" NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "description" TEXT,
    "requirements" TEXT,
    "salaryRange" TEXT,
    "status" "JobPostingStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- AlterTable: job_applications - add new required fields
ALTER TABLE "job_applications" 
  ADD COLUMN "jobPostingId" TEXT,
  ADD COLUMN "applicantName" TEXT;

-- For existing records, set default values before making fields required
UPDATE "job_applications" SET "applicantName" = 'Unknown' WHERE "applicantName" IS NULL;
UPDATE "job_applications" SET "appliedDate" = CURRENT_TIMESTAMP WHERE "appliedDate" IS NULL;

-- Now make the fields NOT NULL
ALTER TABLE "job_applications" 
  ALTER COLUMN "jobPostingId" SET NOT NULL,
  ALTER COLUMN "applicantName" SET NOT NULL,
  ALTER COLUMN "appliedDate" SET NOT NULL,
  ALTER COLUMN "appliedDate" SET DEFAULT CURRENT_TIMESTAMP;

-- Drop the link column if it exists (may not exist in all databases)
ALTER TABLE "job_applications" DROP COLUMN IF EXISTS "link";

-- CreateIndex
CREATE INDEX "job_postings_recruiterId_idx" ON "job_postings"("recruiterId");

CREATE INDEX "job_postings_company_idx" ON "job_postings"("company");

CREATE INDEX "job_postings_status_idx" ON "job_postings"("status");

CREATE INDEX "job_applications_jobPostingId_idx" ON "job_applications"("jobPostingId");

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
