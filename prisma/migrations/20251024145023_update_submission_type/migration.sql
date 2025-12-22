/*
  Warnings:

  - The values [PROCUREMENT,MAINTENANCE,WRITE_OFF,ASSIGNMENT] on the enum `SubmissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."SubmissionType_new" AS ENUM ('DRAFT', 'WAITING_APPROVAL', 'DONE', 'REJECT');
ALTER TABLE "public"."Approval" ALTER COLUMN "submissionType" TYPE "public"."SubmissionType_new" USING ("submissionType"::text::"public"."SubmissionType_new");
ALTER TYPE "public"."SubmissionType" RENAME TO "SubmissionType_old";
ALTER TYPE "public"."SubmissionType_new" RENAME TO "SubmissionType";
DROP TYPE "public"."SubmissionType_old";
COMMIT;
