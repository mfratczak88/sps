import { Id } from '../../domain/id';
import { OperationTimeDays } from '../../domain/parking-lot/operation-time';

export interface DriverReadModel {
  id: Id;
  name: string;
  email: string;
  parkingLots: ParkingLotDto[];
  unAssignedLots: ParkingLotDto[];
  vehicles: {
    licensePlate: string;
  }[];
}

export interface ParkingLotDto {
  id: Id;
  city: string;
  streetName: string;
  streetNumber: string;
  hourFrom: number;
  hourTo: number;
  days: OperationTimeDays[];
}
