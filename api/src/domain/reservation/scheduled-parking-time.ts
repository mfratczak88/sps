import { PeriodOfTime, toSqlTime } from '../period-of-time';
import { DateTime } from 'luxon';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { ParkingTicket } from './parking-ticket';

export class ScheduledParkingTime {
  private readonly period: PeriodOfTime;

  constructor(start: string, end: string) {
    const period = new PeriodOfTime(start, end);
    if (!period.start.hasSame(period.end, 'day')) {
      throw new DomainException({
        message: MessageCode.PARKING_TIME_IN_DIFFERENT_DAYS,
      });
    }
    this.period = period;
  }

  change(start: string, end: string) {
    return new ScheduledParkingTime(start, end);
  }

  inThePast() {
    return this.period.inThePast();
  }

  minutesToStart() {
    const difference = this.period.start.minus(DateTime.now());
    return difference.hour * 60 + difference.minute;
  }

  parkingTicket() {
    return new ParkingTicket({
      timeOfEntry: toSqlTime(DateTime.now()),
      validTo: toSqlTime(this.period.end),
    });
  }

  toPlain(): ScheduledParkingTimePlain {
    return {
      start: toSqlTime(this.period.start),
      end: toSqlTime(this.period.end),
    };
  }
}
export interface ScheduledParkingTimePlain {
  start: string;
  end: string;
}
