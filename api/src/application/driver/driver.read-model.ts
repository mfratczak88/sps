import { Id } from '../../domain/id';

export interface DriverReadModel {
  id: Id;
  name: string;
  email: string;
  parkingLotIds: Id[];
  vehicles: {
    licensePlate: string;
  }[];
  reservationsPendingApprovalIds: Id[];
}
