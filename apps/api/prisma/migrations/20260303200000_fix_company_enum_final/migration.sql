-- Comprehensive idempotent fix:
-- 1. Create Company enum if it doesn't already exist
-- 2. Alter job_applications.company to use the enum only if it's still TEXT

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Company') THEN
    CREATE TYPE "Company" AS ENUM (
      'GOOGLE', 'APPLE', 'MICROSOFT', 'AMAZON', 'META',
      'NETFLIX', 'TESLA', 'TWITTER', 'SPOTIFY', 'ADOBE'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'job_applications'
      AND column_name  = 'company'
      AND data_type    = 'text'
  ) THEN
    -- Normalise values to UPPER so they match enum literals
    UPDATE "job_applications" SET "company" = UPPER("company");
    -- Replace any value that still doesn't match a valid enum member
    UPDATE "job_applications"
    SET "company" = 'GOOGLE'
    WHERE "company" NOT IN (
      'GOOGLE', 'APPLE', 'MICROSOFT', 'AMAZON', 'META',
      'NETFLIX', 'TESLA', 'TWITTER', 'SPOTIFY', 'ADOBE'
    );
    -- Cast the column to the enum type
    ALTER TABLE "job_applications"
      ALTER COLUMN "company" TYPE "Company"
      USING "company"::"Company";
  END IF;
END $$;
