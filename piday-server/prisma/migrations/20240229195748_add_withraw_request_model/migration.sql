-- CreateEnum
CREATE TYPE "WithdrawStatus" AS ENUM ('CREATED', 'INPROGRESS', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "WithddrawRequest" (
    "id" SERIAL NOT NULL,
    "ownerID" TEXT NOT NULL,
    "status" "WithdrawStatus" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WithddrawRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WithddrawRequest" ADD CONSTRAINT "WithddrawRequest_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;
