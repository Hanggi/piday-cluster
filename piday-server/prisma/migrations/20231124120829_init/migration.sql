-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BID', 'ASK');

-- CreateTable
CREATE TABLE "RechargeRecords" (
    "id" SERIAL NOT NULL,
    "ownerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(10,8) NOT NULL,

    CONSTRAINT "RechargeRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualEstate" (
    "id" SERIAL NOT NULL,
    "virtualEstateID" TEXT NOT NULL,
    "lastPrice" DECIMAL(65,30) NOT NULL,
    "address" TEXT,
    "ownerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualEstate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualEstateListing" (
    "id" SERIAL NOT NULL,
    "virtualEstateID" TEXT NOT NULL,
    "ownerID" TEXT NOT NULL,
    "price" DECIMAL(10,8) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualEstateListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualEstateTransactionRecords" (
    "id" SERIAL NOT NULL,
    "virtualEstateID" TEXT NOT NULL,
    "buyerID" TEXT,
    "sellerID" TEXT,
    "price" DECIMAL(10,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualEstateTransactionRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VirtualEstate_virtualEstateID_key" ON "VirtualEstate"("virtualEstateID");
