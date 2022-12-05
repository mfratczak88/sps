import { Id } from '../../domain/id';
import { ReservationStatus } from '../../domain/reservation/reservation-status';

export interface ReservationReadModel {
  id: Id;
  parkingLotId: Id;
  status: ReservationStatus;
  startTime: Date;
  endTime: Date;
  licensePlate: string;
  createdAt: Date;
  parkingTickets: ParkingTicket[];
}

export interface ParkingTicket {
  timeOfEntry: Date;
  timeOfLeave?: Date;
  validTo: Date;
}
