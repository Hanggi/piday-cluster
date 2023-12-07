/*
  Warnings:

  - You are about to drop the column `userId` on the `RechargeRecords` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VirtualEstate` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VirtualEstateListing` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VirtualEstateTransactionRecords` table. All the data in the column will be lost.
  - Made the column `buyerID` on table `VirtualEstateTransactionRecords` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellerID` on table `VirtualEstateTransactionRecords` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RechargeRecords" DROP CONSTRAINT "RechargeRecords_userId_fkey";

-- DropForeignKey
ALTER TABLE "VirtualEstate" DROP CONSTRAINT "VirtualEstate_userId_fkey";

-- DropForeignKey
ALTER TABLE "VirtualEstateListing" DROP CONSTRAINT "VirtualEstateListing_userId_fkey";

-- DropForeignKey
ALTER TABLE "VirtualEstateTransactionRecords" DROP CONSTRAINT "VirtualEstateTransactionRecords_userId_fkey";

-- AlterTable
ALTER TABLE "RechargeRecords" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "VirtualEstate" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "VirtualEstateListing" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "VirtualEstateTransactionRecords" DROP COLUMN "userId",
ALTER COLUMN "buyerID" SET NOT NULL,
ALTER COLUMN "sellerID" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "RechargeRecords" ADD CONSTRAINT "RechargeRecords_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualEstate" ADD CONSTRAINT "VirtualEstate_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualEstateListing" ADD CONSTRAINT "VirtualEstateListing_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualEstateTransactionRecords" ADD CONSTRAINT "VirtualEstateTransactionRecords_buyerID_fkey" FOREIGN KEY ("buyerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualEstateTransactionRecords" ADD CONSTRAINT "VirtualEstateTransactionRecords_sellerID_fkey" FOREIGN KEY ("sellerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;
