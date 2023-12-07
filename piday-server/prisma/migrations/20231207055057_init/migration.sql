-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BID', 'ASK');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "keycloakID" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RechargeRecords" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "ownerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualEstate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualEstateListing" (
    "id" SERIAL NOT NULL,
    "virtualEstateID" TEXT NOT NULL,
    "price" DECIMAL(18,8) NOT NULL,
    "type" "TransactionType" NOT NULL,
    "ownerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualEstateListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualEstateTransactionRecords" (
    "id" SERIAL NOT NULL,
    "virtualEstateID" TEXT NOT NULL,
    "buyerID" TEXT NOT NULL,
    "sellerID" TEXT NOT NULL,
    "price" DECIMAL(18,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VirtualEstateTransactionRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_keycloakID_key" ON "User"("keycloakID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualEstate_virtualEstateID_key" ON "VirtualEstate"("virtualEstateID");

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
