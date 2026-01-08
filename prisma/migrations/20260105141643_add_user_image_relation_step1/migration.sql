-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "imageId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
