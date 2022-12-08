import { Id } from './common.model';

export interface Reservation {
  id: Id;
  parkingLotId: Id;
  status: ReservationStatus;
  startTime: Date;
  endTime: Date;
  date: Date;
  licensePlate: string;
  city: string;
  streetName: string;
  streetNumber: string;
  approvalTimeStart?: Date;
  approvalDeadLine?: Date;
  parkingTickets: ParkingTicket[];
}

export interface Reservations {
  data: Reservation[];
  page: number;
  pageSize: number;
  count: number;
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
export enum SortBy {
  STATUS = 'status',
  PARKING_LOT = 'parkingLot',
  CREATED_AT = 'createdAt',
}

export enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}
export interface ReservationQueryModel {
  driverId?: Id;
  status?: ReservationStatus;
  parkingLotId?: Id;
  page?: number;
  pageSize?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
