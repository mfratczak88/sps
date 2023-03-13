/*
  Warnings:

  - Added the required column `hourFrom` to the `ParkingLot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hourTo` to the `ParkingLot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minuteFrom` to the `ParkingLot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minuteTo` to the `ParkingLot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingLot" ADD COLUMN     "hourFrom" INTEGER NOT NULL,
ADD COLUMN     "hourTo" INTEGER NOT NULL,
ADD COLUMN     "minuteFrom" INTEGER NOT NULL,
ADD COLUMN     "minuteTo" INTEGER NOT NULL;
