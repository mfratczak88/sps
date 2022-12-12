import {
  Reservation,
  ReservationStatus,
} from '../src/app/core/model/reservation.model';
import { DateTime } from 'luxon';

export const reservations: Reservation[] = [
  {
    id: '88811d7b-677a-423c-a7d4-495a749e0997',
    parkingLotId: 'd4fa2b3c-84f7-4861-b1ef-db28a13f3a87',
    endTime: '2022-12-15T21:00:00.000Z',
    licensePlate: 'WI848JG',
    parkingTickets: [],
    city: 'Warszawa',
    streetName: 'Plac Politechniki',
    streetNumber: '12',
    startTime: '2022-12-15T08:00:00.000Z',
    date: '2022-12-15T08:00:00.000Z',
    status: ReservationStatus.CANCELLED,
  },
  {
    id: '85354fef-180f-451a-9967-1d6f6652f0e4',
    parkingLotId: 'd4fa2b3c-84f7-4861-b1ef-db28a13f3a87',
    endTime: '2022-12-05T22:00:00.000Z',
    licensePlate: 'WI848JG',
    parkingTickets: [],
    city: 'Warszawa',
    streetName: 'Plac Politechniki',
    streetNumber: '12',
    startTime: '2022-12-06T20:00:00.000Z',
    date: '2022-12-06T20:00:00.000Z',
    status: ReservationStatus.CONFIRMED,
  },
];
export const hoursFromReservations = (reservation: Reservation) => {
  const { startTime, endTime } = reservation;
  const hourFrom = DateTime.fromISO(startTime).hour;
  const hourTo = DateTime.fromISO(endTime).hour;
  return {
    hourFrom,
    hourTo,
  };
};
