/*
  Warnings:

  - You are about to drop the column `isManager` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `manager` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isManager",
DROP COLUMN "manager",
ADD COLUMN     "teamLead" TEXT,
ALTER COLUMN "role" SET DEFAULT 'STAFF';
