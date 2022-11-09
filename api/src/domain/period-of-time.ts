import { DateTime, Interval } from 'luxon';
import { DomainException } from './domain.exception';
import { MessageCode } from '../message';

export class PeriodOfTime {
  private readonly interval: Interval;

  get start() {
    return this.interval.start;
  }

  get end() {
    return this.interval.end;
  }

  constructor(start: string, end: string) {
    const interval = PeriodOfTime.fromString(start, end);
    if (!interval.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_DATE_TIME_INTERVAL,
      });
    }
    this.interval = interval;
  }

  inThePast() {
    return this.interval.isBefore(DateTime.now());
  }

  equal(start: string, end: string) {
    const interval = PeriodOfTime.fromString(start, end);
    return this.interval.equals(interval);
  }

  private static fromString(start: string, end: string) {
    return Interval.fromDateTimes(
      DateTime.fromSQL(start),
      DateTime.fromSQL(end),
    );
  }
}

export const toHoursAndMinutes = (dateTime: DateTime) => {
  const [hours, minutes] = dateTime
    .toSQLTime({ includeOffset: false })
    .split('.')[0]
    .split(':');
  return `${hours}:${minutes}`;
};
export const toSqlTime = (dateTime: DateTime) =>
  dateTime.toSQLTime({ includeOffset: false });
export const fromSqlTime = (time: string) => DateTime.fromSQL(time);
