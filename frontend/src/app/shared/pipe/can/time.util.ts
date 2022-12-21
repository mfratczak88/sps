import { DateTime } from 'luxon';

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
