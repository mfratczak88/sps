import { ParkingLotBaseModel } from './parking-lot.model';

export interface Driver {
  id: string;
  name: string;
  email: string;
  parkingLots: ParkingLotBaseModel[];
  vehicles: Vehicle[];
}
export interface Vehicle {
  licensePlate: string;
}
export interface AssignDriverToParkingLot {
  driverId: string;
  parkingLotId: string;
}
export interface RemoveParkingLotAssignment {
  driverId: string;
  parkingLotId: string;
}
