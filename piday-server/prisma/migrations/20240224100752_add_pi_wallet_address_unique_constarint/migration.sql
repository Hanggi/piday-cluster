/*
  Warnings:

  - A unique constraint covering the columns `[piWalletAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inviterID" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_piWalletAddress_key" ON "User"("piWalletAddress");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inviterID_fkey" FOREIGN KEY ("inviterID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
