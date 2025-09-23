-- DropForeignKey
ALTER TABLE "public"."ApprovalSignature" DROP CONSTRAINT "ApprovalSignature_userId_fkey";

-- AlterTable
ALTER TABLE "public"."ApprovalSignature" ADD COLUMN     "email" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ApprovalSignature" ADD CONSTRAINT "ApprovalSignature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
