import { Id } from './common.model';
import { Reservation } from './reservation.model';

export interface Driver {
  id: string;
  name: string;
  email: string;
  parkingLotIds: Id[];
  vehicles: Vehicle[];
}

export interface Vehicle {
  licensePlate: string;
}
export type DriverReservation = Reservation & {
  parkingLot: {
    city: string;
    streetName: string;
    streetNumber: string;
  };
};
export interface DriverReservations {
  pendingAction: DriverReservation[];
  dueNext: DriverReservation[];
  history: DriverReservation[];
}
