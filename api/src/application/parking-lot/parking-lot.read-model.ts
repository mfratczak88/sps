import { Id } from '../../domain/id';

export interface ParkingLotReadModel {
  id: Id;
  createdAt: string;
  city: string;
  streetName: string;
  capacity: number;
  hourFrom: string;
  hourTo: string;
}
