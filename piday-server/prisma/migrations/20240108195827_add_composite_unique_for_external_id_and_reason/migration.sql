/*
  Warnings:

  - A unique constraint covering the columns `[externalID,reason]` on the table `RechargeRecords` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listingID]` on the table `VirtualEstateListing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionID]` on the table `VirtualEstateTransactionRecords` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RechargeRecords_externalID_reason_key" ON "RechargeRecords"("externalID", "reason");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualEstateListing_listingID_key" ON "VirtualEstateListing"("listingID");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualEstateTransactionRecords_transactionID_key" ON "VirtualEstateTransactionRecords"("transactionID");
