import { Id } from './common.model';

export interface Driver {
  id: string;
  name: string;
  email: string;
  parkingLotIds: Id[];
  vehicles: Vehicle[];
  reservationsPendingApprovalIds: Id[];
}

export interface Vehicle {
  licensePlate: string;
}
