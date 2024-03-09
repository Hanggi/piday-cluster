-- CreateTable
CREATE TABLE "PointRecords" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "reason" TEXT NOT NULL,
    "externalID" TEXT NOT NULL,
    "ownerID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointRecords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PointRecords" ADD CONSTRAINT "PointRecords_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("keycloakID") ON DELETE RESTRICT ON UPDATE CASCADE;
