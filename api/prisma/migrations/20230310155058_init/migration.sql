-- CreateEnum
CREATE TYPE "RegistrationMethod" AS ENUM ('manual', 'google');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'clerk', 'driver');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('Draft', 'Cancelled', 'Confirmed');

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING,
    "active" BOOL NOT NULL,
    "refreshToken" STRING,
    "registrationMethod" "RegistrationMethod" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'driver',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationToken" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "activationGuid" STRING NOT NULL,
    "guidValidTo" STRING NOT NULL,

    CONSTRAINT "RegistrationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "licensePlate" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("licensePlate")
);

-- CreateTable
CREATE TABLE "ParkingLot" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "city" STRING NOT NULL,
    "streetName" STRING NOT NULL,
    "streetNumber" STRING NOT NULL,
    "capacity" INT4 NOT NULL,
    "operationTimeRule" STRING NOT NULL,

    CONSTRAINT "ParkingLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licensePlate" STRING NOT NULL,
    "parkingLotId" STRING NOT NULL,
    "startTime" TIMESTAMP(0) NOT NULL,
    "endTime" TIMESTAMP(0) NOT NULL,
    "status" "ReservationStatus" NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParkingTicket" (
    "id" STRING NOT NULL,
    "reservationId" STRING NOT NULL,
    "timeOfEntry" TIMESTAMP(0) NOT NULL,
    "validTo" TIMESTAMP(0) NOT NULL,
    "timeOfLeave" TIMESTAMP(0),

    CONSTRAINT "ParkingTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParkingLotToUser" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParkingLotToUser_AB_unique" ON "_ParkingLotToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ParkingLotToUser_B_index" ON "_ParkingLotToUser"("B");

-- AddForeignKey
ALTER TABLE "RegistrationToken" ADD CONSTRAINT "RegistrationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_licensePlate_fkey" FOREIGN KEY ("licensePlate") REFERENCES "Vehicle"("licensePlate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "ParkingLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingTicket" ADD CONSTRAINT "ParkingTicket_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParkingLotToUser" ADD CONSTRAINT "_ParkingLotToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ParkingLot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParkingLotToUser" ADD CONSTRAINT "_ParkingLotToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
