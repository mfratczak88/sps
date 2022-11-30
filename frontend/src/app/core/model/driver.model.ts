import { OperationTimeDays } from './common.model';

export interface Driver {
  id: string;
  name: string;
  email: string;
  parkingLots: ParkingLot[];
  vehicles: Vehicle[];
  unAssignedLots: ParkingLot[];
}

export interface Vehicle {
  licensePlate: string;
}

export interface ParkingLot {
  id: string;
  city: string;
  streetName: string;
  streetNumber: string;
  hourFrom: number;
  hourTo: number;
  days: OperationTimeDays[];
}
