/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `is_device` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "is_deleted",
DROP COLUMN "is_device",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDevice" BOOLEAN NOT NULL DEFAULT false;
