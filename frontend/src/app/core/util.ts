import { Reservation } from './model/reservation.model';
import { DateTime } from 'luxon';

export const hoursOf = (reservation: Reservation) => {
  const { startTime, endTime } = reservation;
  const hour = (h: string) => DateTime.fromISO(h).hour;
  return {
    hourFrom: hour(startTime),
    hourTo: hour(endTime),
  };
};
export const fullHour = (dateTime: DateTime, hour: number) => {
  return dateTime
    .set({
      hour: hour,
      second: 0,
      minute: 0,
      millisecond: 0,
    })
    .toJSDate();
};
