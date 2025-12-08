-- AddForeignKey
ALTER TABLE "public"."ApprovalAsset" ADD CONSTRAINT "ApprovalAsset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
