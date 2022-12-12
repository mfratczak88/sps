import { Id } from './common.model';
import { Reservation } from './reservation.model';

export interface Driver {
  id: string;
  name: string;
  email: string;
  parkingLotIds: Id[];
  vehicles: Vehicle[];
  timeHorizon?: {
    dueNext?: Reservation[];
    ongoing?: Reservation[];
    pendingAction?: Reservation[];
  };
}
export interface Vehicle {
  licensePlate: string;
}
export interface DriverQueryModel {
  timeHorizon?: TimeHorizon[];
}
export enum TimeHorizon {
  ONGOING = 'ongoing',
  DUE_NEXT = 'dueNext',
  PENDING_ACTION = 'pendingAction',
}
