import { Id } from '../../domain/id';
import { ReservationReadModel } from '../reservation/reservation.read-model';

export interface DriverReadModel {
  id: Id;
  name: string;
  email: string;
  parkingLotIds: Id[];
  vehicles: {
    licensePlate: string;
  }[];
}
export interface DriverReservations {
  pendingAction: DriverReservationReadModel[];
  dueNext: DriverReservationReadModel[];
  history: DriverReservationReadModel[];
}
export type DriverReservationReadModel = ReservationReadModel & {
  parkingLot: {
    city: string;
    streetName: string;
    streetNumber: string;
  };
};
