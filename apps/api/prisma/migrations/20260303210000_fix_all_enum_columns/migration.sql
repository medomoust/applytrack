-- ============================================================
-- Comprehensive idempotent enum column repair
-- Fixes every column that may still be stored as TEXT in prod
-- ============================================================

-- 1. Ensure JobPostingStatus enum exists (may have never been created)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'JobPostingStatus') THEN
    CREATE TYPE "JobPostingStatus" AS ENUM ('open', 'closed');
  END IF;
END $$;

-- 2. Fix UserRole: if enum still has old values (user/admin), migrate to (applicant/recruiter)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'UserRole' AND e.enumlabel = 'user'
  ) THEN
    -- Convert column to text first
    ALTER TABLE "users" ALTER COLUMN "role" TYPE text;
    -- Remap old values
    UPDATE "users" SET "role" = 'applicant' WHERE "role" IN ('user', 'applicant');
    UPDATE "users" SET "role" = 'recruiter' WHERE "role" IN ('admin', 'recruiter');
    UPDATE "users" SET "role" = 'applicant' WHERE "role" NOT IN ('applicant', 'recruiter');
    -- Drop and recreate enum
    DROP TYPE "UserRole";
    CREATE TYPE "UserRole" AS ENUM ('recruiter', 'applicant');
    -- Cast column back
    ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";
    ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'applicant'::"UserRole";
  END IF;
END $$;

-- 3. Add users.company column if missing (from rolled-back migration)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company'
  ) THEN
    ALTER TABLE "users" ADD COLUMN "company" "Company";
  END IF;
END $$;

-- 4. Add users.isAdmin column if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'isAdmin'
  ) THEN
    ALTER TABLE "users" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- 5. Add users.resumeUrl column if missing
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'resumeUrl'
  ) THEN
    ALTER TABLE "users" ADD COLUMN "resumeUrl" TEXT;
  END IF;
END $$;

-- 6. Fix job_applications.status (text → ApplicationStatus)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_applications' AND column_name = 'status' AND data_type = 'text'
  ) THEN
    UPDATE "job_applications"
    SET "status" = 'applied'
    WHERE "status" NOT IN ('wishlist','applied','interview','offer','rejected','ghosted');
    ALTER TABLE "job_applications"
      ALTER COLUMN "status" TYPE "ApplicationStatus"
      USING "status"::"ApplicationStatus";
  END IF;
END $$;

-- 7. Fix job_applications.workMode (text → WorkMode)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_applications' AND column_name = 'workMode' AND data_type = 'text'
  ) THEN
    UPDATE "job_applications"
    SET "workMode" = 'remote'
    WHERE "workMode" NOT IN ('remote','hybrid','onsite');
    ALTER TABLE "job_applications"
      ALTER COLUMN "workMode" TYPE "WorkMode"
      USING "workMode"::"WorkMode";
  END IF;
END $$;

-- 8. Fix job_applications.employmentType (text → EmploymentType)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_applications' AND column_name = 'employmentType' AND data_type = 'text'
  ) THEN
    UPDATE "job_applications"
    SET "employmentType" = 'fulltime'
    WHERE "employmentType" NOT IN ('fulltime','contract','intern');
    ALTER TABLE "job_applications"
      ALTER COLUMN "employmentType" TYPE "EmploymentType"
      USING "employmentType"::"EmploymentType";
  END IF;
END $$;

-- 9. Fix job_applications.priority (text → Priority)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_applications' AND column_name = 'priority' AND data_type = 'text'
  ) THEN
    UPDATE "job_applications"
    SET "priority" = 'medium'
    WHERE "priority" NOT IN ('low','medium','high');
    ALTER TABLE "job_applications"
      ALTER COLUMN "priority" TYPE "Priority"
      USING "priority"::"Priority";
  END IF;
END $$;

-- 10. Fix activity_logs.eventType (text → ActivityEventType)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activity_logs' AND column_name = 'eventType' AND data_type = 'text'
  ) THEN
    UPDATE "activity_logs"
    SET "eventType" = 'updated'
    WHERE "eventType" NOT IN ('created','updated','status_changed','archived','restored','note_added');
    ALTER TABLE "activity_logs"
      ALTER COLUMN "eventType" TYPE "ActivityEventType"
      USING "eventType"::"ActivityEventType";
  END IF;
END $$;

-- 11. Create job_postings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "job_postings" (
  "id"             TEXT NOT NULL,
  "recruiterId"    TEXT NOT NULL,
  "company"        TEXT NOT NULL,
  "roleTitle"      TEXT NOT NULL,
  "location"       TEXT,
  "workMode"       TEXT NOT NULL,
  "employmentType" TEXT NOT NULL,
  "description"    TEXT,
  "requirements"   TEXT,
  "salaryRange"    TEXT,
  "status"         TEXT NOT NULL DEFAULT 'open',
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- 12. Fix job_postings.company (text → Company)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_postings' AND column_name = 'company' AND data_type = 'text'
  ) THEN
    UPDATE "job_postings"
    SET "company" = 'GOOGLE'
    WHERE UPPER("company") NOT IN ('GOOGLE','APPLE','MICROSOFT','AMAZON','META','NETFLIX','TESLA','TWITTER','SPOTIFY','ADOBE');
    UPDATE "job_postings" SET "company" = UPPER("company");
    ALTER TABLE "job_postings"
      ALTER COLUMN "company" TYPE "Company"
      USING "company"::"Company";
  END IF;
END $$;

-- 13. Fix job_postings.workMode (text → WorkMode)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_postings' AND column_name = 'workMode' AND data_type = 'text'
  ) THEN
    UPDATE "job_postings"
    SET "workMode" = 'remote'
    WHERE "workMode" NOT IN ('remote','hybrid','onsite');
    ALTER TABLE "job_postings"
      ALTER COLUMN "workMode" TYPE "WorkMode"
      USING "workMode"::"WorkMode";
  END IF;
END $$;

-- 14. Fix job_postings.employmentType (text → EmploymentType)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_postings' AND column_name = 'employmentType' AND data_type = 'text'
  ) THEN
    UPDATE "job_postings"
    SET "employmentType" = 'fulltime'
    WHERE "employmentType" NOT IN ('fulltime','contract','intern');
    ALTER TABLE "job_postings"
      ALTER COLUMN "employmentType" TYPE "EmploymentType"
      USING "employmentType"::"EmploymentType";
  END IF;
END $$;

-- 15. Fix job_postings.status (text → JobPostingStatus)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_postings' AND column_name = 'status' AND data_type = 'text'
  ) THEN
    UPDATE "job_postings"
    SET "status" = 'open'
    WHERE "status" NOT IN ('open','closed');
    -- Must drop default before changing type
    ALTER TABLE "job_postings" ALTER COLUMN "status" DROP DEFAULT;
    ALTER TABLE "job_postings"
      ALTER COLUMN "status" TYPE "JobPostingStatus"
      USING "status"::"JobPostingStatus";
    ALTER TABLE "job_postings"
      ALTER COLUMN "status" SET DEFAULT 'open'::"JobPostingStatus";
  END IF;
END $$;

-- 16. Ensure indexes and foreign keys exist (safe if already present)
CREATE INDEX IF NOT EXISTS "job_postings_recruiterId_idx" ON "job_postings"("recruiterId");
CREATE INDEX IF NOT EXISTS "job_postings_company_idx" ON "job_postings"("company");
CREATE INDEX IF NOT EXISTS "job_postings_status_idx" ON "job_postings"("status");
