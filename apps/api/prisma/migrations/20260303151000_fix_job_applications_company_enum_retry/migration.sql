-- Retry: ensure job_applications.company uses Company enum
ALTER TABLE "job_applications"
  ALTER COLUMN "company" TYPE "Company"
  USING "company"::"Company";
