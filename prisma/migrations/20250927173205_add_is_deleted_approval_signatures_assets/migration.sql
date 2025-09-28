-- AlterTable
ALTER TABLE "public"."ApprovalAsset" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."ApprovalSignature" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
