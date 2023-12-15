/*
  Warnings:

  - Added the required column `externalID` to the `RechargeRecords` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `RechargeRecords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RechargeRecords" ADD COLUMN     "externalID" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;
