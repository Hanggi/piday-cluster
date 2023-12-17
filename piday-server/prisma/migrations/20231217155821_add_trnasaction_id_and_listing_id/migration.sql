/*
  Warnings:

  - Added the required column `listingID` to the `VirtualEstateListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionID` to the `VirtualEstateTransactionRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VirtualEstateListing" ADD COLUMN     "listingID" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "VirtualEstateTransactionRecords" ADD COLUMN     "transactionID" BIGINT NOT NULL;
