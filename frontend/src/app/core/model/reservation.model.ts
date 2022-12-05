export interface Reservation {
  id: string;
  createdAt: string;
  parkingLotId: string;
  licensePlate: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  parkingTickets: ParkingTicket[];
}

export enum ReservationStatus {
  DRAFT = 'Draft',
  CANCELLED = 'Cancelled',
  ACCEPTED = 'Accepted',
}

export interface ParkingTicket {
  timeOfEntry: Date;
  timeOfLeave?: Date;
  validTo: Date;
}

export interface MakeReservation {
  licensePlate: string;
  parkingLotId: string;
  start: Date;
  end: Date;
}
export type ReservationWithParkingLot = Reservation & {
  parkingLot: {
    city: string;
    streetName: string;
    streetNumber: string;
  };
};
