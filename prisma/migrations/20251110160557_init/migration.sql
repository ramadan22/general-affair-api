-- CreateEnum
CREATE TYPE "public"."HistoryType" AS ENUM ('APPROVAL', 'ASSIGNMENT');

-- CreateTable
CREATE TABLE "public"."ApprovalHistory" (
    "id" TEXT NOT NULL,
    "assetId" TEXT,
    "approvalId" TEXT,
    "type" "public"."HistoryType" NOT NULL,
    "description" TEXT,
    "fromUserId" TEXT,
    "toUserId" TEXT,
    "performedById" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApprovalHistory_assetId_idx" ON "public"."ApprovalHistory"("assetId");

-- CreateIndex
CREATE INDEX "ApprovalHistory_approvalId_idx" ON "public"."ApprovalHistory"("approvalId");

-- CreateIndex
CREATE INDEX "ApprovalHistory_type_idx" ON "public"."ApprovalHistory"("type");

-- AddForeignKey
ALTER TABLE "public"."ApprovalHistory" ADD CONSTRAINT "ApprovalHistory_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "public"."Approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalHistory" ADD CONSTRAINT "ApprovalHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalHistory" ADD CONSTRAINT "ApprovalHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
