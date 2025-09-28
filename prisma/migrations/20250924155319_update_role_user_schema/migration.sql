-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'MANAGER';

-- AlterTable
ALTER TABLE "public"."ApprovalSignature" ADD COLUMN     "updatedAt" TIMESTAMP(3);
