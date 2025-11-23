/*
  Warnings:

  - The values [READY_ON_PROGRESS,ON_PROGRESS,ORDERED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,WAITING_APPROVAL,DONE,REJECT] on the enum `SubmissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RequestStatus_new" AS ENUM ('DRAFT', 'WAITING_APPROVAL', 'DONE', 'REJECT');
ALTER TABLE "public"."Approval" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Approval" ALTER COLUMN "status" TYPE "public"."RequestStatus_new" USING ("status"::text::"public"."RequestStatus_new");
ALTER TYPE "public"."RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "public"."RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "public"."RequestStatus_old";
ALTER TABLE "public"."Approval" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."SubmissionType_new" AS ENUM ('PROCUREMENT', 'MAINTENANCE', 'WRITE_OFF', 'ASSIGNMENT');
ALTER TABLE "public"."Approval" ALTER COLUMN "submissionType" TYPE "public"."SubmissionType_new" USING ("submissionType"::text::"public"."SubmissionType_new");
ALTER TYPE "public"."SubmissionType" RENAME TO "SubmissionType_old";
ALTER TYPE "public"."SubmissionType_new" RENAME TO "SubmissionType";
DROP TYPE "public"."SubmissionType_old";
COMMIT;
