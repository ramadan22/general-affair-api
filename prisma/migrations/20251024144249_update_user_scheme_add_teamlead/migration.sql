/*
  Warnings:

  - You are about to drop the column `teamLead` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "teamLead",
ADD COLUMN     "teamLeadId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
