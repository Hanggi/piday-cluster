/*
  Warnings:

  - A unique constraint covering the columns `[piWalletAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inviteeID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_piWalletAddress_key" ON "User"("piWalletAddress");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inviteeID_fkey" FOREIGN KEY ("inviteeID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
