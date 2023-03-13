-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'clerk', 'driver');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'driver';
