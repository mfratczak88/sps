/*
  Warnings:

  - You are about to drop the column `minuteFrom` on the `ParkingLot` table. All the data in the column will be lost.
  - You are about to drop the column `minuteTo` on the `ParkingLot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ParkingLot" DROP COLUMN "minuteFrom",
DROP COLUMN "minuteTo",
ALTER COLUMN "hourFrom" SET DATA TYPE TEXT,
ALTER COLUMN "hourTo" SET DATA TYPE TEXT;
