-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('Draft', 'Cancelled', 'Confirmed');

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licensePlate" TEXT NOT NULL,
    "parkingLotId" TEXT NOT NULL,
    "startTime" TIMESTAMP(0) NOT NULL,
    "endTime" TIMESTAMP(0) NOT NULL,
    "status" "ReservationStatus" NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingTicket" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "timeOfEntry" TIMESTAMP(0) NOT NULL,
    "validTo" TIMESTAMP(0) NOT NULL,
    "timeOfLeave" TIMESTAMP(0) NOT NULL,

    CONSTRAINT "ParkingTicket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_licensePlate_fkey" FOREIGN KEY ("licensePlate") REFERENCES "Vehicle"("licensePlate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "ParkingLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingTicket" ADD CONSTRAINT "ParkingTicket_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
