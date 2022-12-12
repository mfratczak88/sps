import { Id } from './common.model';
import { ReservationStatusKey } from '../translation-keys';

export interface Reservation {
  id: Id;
  parkingLotId: Id;
  status: ReservationStatus;
  startTime: string;
  endTime: string;
  date: string;
  licensePlate: string;
  city: string;
  streetName: string;
  streetNumber: string;
  approvalTimeStart?: string;
  approvalDeadLine?: string;
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
  CONFIRMED = 'Confirmed',
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
  onlyHistory?: boolean;
}

export const ReservationStatusTranslationKey = {
  [ReservationStatus.DRAFT]: ReservationStatusKey.DRAFT,
  [ReservationStatus.CONFIRMED]: ReservationStatusKey.CONFIRMED,
  [ReservationStatus.CANCELLED]: ReservationStatusKey.CANCELLED,
};

export interface ChangeTime {
  reservationId: Id;
  start: Date;
  end: Date;
}
