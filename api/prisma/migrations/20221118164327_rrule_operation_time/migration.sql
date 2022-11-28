/*
  Warnings:

  - You are about to drop the column `hourFrom` on the `ParkingLot` table. All the data in the column will be lost.
  - You are about to drop the column `hourTo` on the `ParkingLot` table. All the data in the column will be lost.
  - Added the required column `operationTimeRule` to the `ParkingLot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingLot" DROP COLUMN "hourFrom",
DROP COLUMN "hourTo",
ADD COLUMN     "operationTimeRule" TEXT NOT NULL;
