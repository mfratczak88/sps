import { Id } from '../../domain/id';

export interface DriverReadModel {
  id: Id;
  name: string;
  email: string;
  parkingLots: ParkingLotDto[];
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
}
