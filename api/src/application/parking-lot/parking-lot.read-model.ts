import { Id } from '../../domain/id';
import { OperationTimeDays } from '../../domain/parking-lot/operation-time';

export interface ParkingLotReadModel {
  id: Id;
  createdAt: string;
  city: string;
  streetName: string;
  capacity: number;
  hourFrom: number;
  hourTo: number;
  validFrom: Date;
  days: OperationTimeDays[];
}
