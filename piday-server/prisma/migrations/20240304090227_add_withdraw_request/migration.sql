-- CreateEnum
CREATE TYPE "WithdrawStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CANCELED');

-- CreateTable
CREATE TABLE "WithdrawRequest" (
    "id" SERIAL NOT NULL,
    "withdrawStatusID" BIGINT NOT NULL,
    "ownerID" TEXT NOT NULL,
    "status" "WithdrawStatus" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithdrawRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawRequest_withdrawStatusID_key" ON "WithdrawRequest"("withdrawStatusID");

-- AddForeignKey
ALTER TABLE "WithdrawRequest" ADD CONSTRAINT "WithdrawRequest_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;
