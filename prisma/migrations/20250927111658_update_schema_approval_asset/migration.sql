-- DropForeignKey
ALTER TABLE "public"."ApprovalAsset" DROP CONSTRAINT "ApprovalAsset_approvalId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApprovalAsset" DROP CONSTRAINT "ApprovalAsset_assetId_fkey";

-- AlterTable
ALTER TABLE "public"."ApprovalAsset" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isMaintenance" BOOLEAN DEFAULT false,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "serialNumber" TEXT,
ALTER COLUMN "approvalId" DROP NOT NULL,
ALTER COLUMN "assetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ApprovalAsset" ADD CONSTRAINT "ApprovalAsset_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "public"."Approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalAsset" ADD CONSTRAINT "ApprovalAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
