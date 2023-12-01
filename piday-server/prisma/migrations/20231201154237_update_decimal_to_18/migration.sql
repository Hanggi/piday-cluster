-- AlterTable
ALTER TABLE "RechargeRecords" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,8);

-- AlterTable
ALTER TABLE "VirtualEstateListing" ALTER COLUMN "price" SET DATA TYPE DECIMAL(18,8);

-- AlterTable
ALTER TABLE "VirtualEstateTransactionRecords" ALTER COLUMN "price" SET DATA TYPE DECIMAL(18,8);
