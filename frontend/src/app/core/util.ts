import { Reservation } from './model/reservation.model';
import { DateTime } from 'luxon';
import { Id } from './model/common.model';

export const hoursOf = (reservation: Reservation) => {
  const { startTime, endTime } = reservation;
  const hour = (h: string) => DateTime.fromISO(h).hour;
  return {
    hourFrom: hour(startTime),
    hourTo: hour(endTime),
  };
};
export const isNowBefore = (date: string) => {
  return (
    DateTime.fromISO(date)
      .diffNow('seconds')
      .as('seconds') > 0
  );
};

export const isNowAfter = (date: string) => {
  return (
    DateTime.fromISO(date)
      .diffNow('seconds')
      .as('seconds') < 0
  );
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

export const mapToObjectWithIds = <T extends { id: Id }>(collection: T[]) => {
  return collection.reduce((acc, element) => {
    const { id } = element;
    return {
      ...acc,
      [id]: element,
    };
  }, {});
};
export const today = () => fullHour(DateTime.now(), 0);
