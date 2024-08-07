-- AddForeignKey
ALTER TABLE "VirtualEstateTransactionRecords" ADD CONSTRAINT "VirtualEstateTransactionRecords_virtualEstateID_fkey" FOREIGN KEY ("virtualEstateID") REFERENCES "VirtualEstate"("virtualEstateID") ON DELETE RESTRICT ON UPDATE CASCADE;
