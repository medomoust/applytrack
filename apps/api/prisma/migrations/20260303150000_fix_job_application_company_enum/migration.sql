-- Fix job_applications.company to use Company enum
ALTER TABLE "job_applications"
  ALTER COLUMN "company" TYPE "Company"
  USING "company"::"Company";
