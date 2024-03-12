-- AddForeignKey
ALTER TABLE "VirtualEstateListing" ADD CONSTRAINT "VirtualEstateListing_virtualEstateID_fkey" FOREIGN KEY ("virtualEstateID") REFERENCES "VirtualEstate"("virtualEstateID") ON DELETE RESTRICT ON UPDATE CASCADE;
