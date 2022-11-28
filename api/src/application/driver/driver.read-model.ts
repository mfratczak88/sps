import { Id } from '../../domain/id';

export interface DriverReadModel {
  id: Id;
  name: string;
  parkingLots: ParkingLotDto[];
}
export interface ParkingLotDto {
  id: Id;
  city: string;
  streetName: string;
  streetNumber: string;
  hourFrom: number;
  hourTo: number;
}
