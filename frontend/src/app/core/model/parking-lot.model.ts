import { OperationTimeDays } from './common.model';

export interface AssignDriverToParkingLot {
  driverId: string;
  parkingLotId: string;
}

export interface RemoveParkingLotAssignment {
  driverId: string;
  parkingLotId: string;
}

export interface ParkingLot {
  id: string;
  city: string;
  streetName: string;
  streetNumber: string;
  hourFrom: number;
  hourTo: number;
  days: OperationTimeDays[];
  createdAt: string;
  capacity: number;
  validFrom: Date;
}

export interface HoursOfOperation {
  hourFrom: number;
  hourTo: number;
}

export type ChangeHoursOfOperations = HoursOfOperation;

export interface CreateParkingLotData {
  capacity: number;
  hoursOfOperation: {
    hourFrom: number;
    hourTo: number;
    validFrom: Date;
    days: OperationTimeDays[];
  };
  address: {
    city: string;
    streetName: string;
    streetNumber: string;
  };
}

export interface Address {
  city: string;
  streetName: string;
  streetNumber: string;
}
