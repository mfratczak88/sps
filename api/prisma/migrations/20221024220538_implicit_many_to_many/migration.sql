/*
  Warnings:

  - You are about to drop the `UserParkingLots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserParkingLots" DROP CONSTRAINT "UserParkingLots_parkingLotId_fkey";

-- DropForeignKey
ALTER TABLE "UserParkingLots" DROP CONSTRAINT "UserParkingLots_userId_fkey";

-- DropTable
DROP TABLE "UserParkingLots";

-- CreateTable
CREATE TABLE "_ParkingLotToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParkingLotToUser_AB_unique" ON "_ParkingLotToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ParkingLotToUser_B_index" ON "_ParkingLotToUser"("B");

-- AddForeignKey
ALTER TABLE "_ParkingLotToUser" ADD CONSTRAINT "_ParkingLotToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ParkingLot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParkingLotToUser" ADD CONSTRAINT "_ParkingLotToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
