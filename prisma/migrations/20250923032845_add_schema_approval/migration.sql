-- CreateEnum
CREATE TYPE "public"."SubmissionType" AS ENUM ('PROCUREMENT', 'MAINTENANCE', 'WRITE_OFF', 'ASSIGNMENT');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('DRAFT', 'WAITING_APPROVAL', 'READY_ON_PROGRESS', 'ON_PROGRESS', 'DONE', 'ORDERED');

-- CreateTable
CREATE TABLE "public"."Approval" (
    "id" TEXT NOT NULL,
    "submissionType" "public"."SubmissionType" NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "requestedForId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApprovalSignature" (
    "id" TEXT NOT NULL,
    "approvalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "signedAt" TIMESTAMP(3),

    CONSTRAINT "ApprovalSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApprovalAsset" (
    "id" TEXT NOT NULL,
    "approvalId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "ApprovalAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Approval" ADD CONSTRAINT "Approval_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Approval" ADD CONSTRAINT "Approval_requestedForId_fkey" FOREIGN KEY ("requestedForId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalSignature" ADD CONSTRAINT "ApprovalSignature_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "public"."Approval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalSignature" ADD CONSTRAINT "ApprovalSignature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalAsset" ADD CONSTRAINT "ApprovalAsset_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "public"."Approval"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApprovalAsset" ADD CONSTRAINT "ApprovalAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
