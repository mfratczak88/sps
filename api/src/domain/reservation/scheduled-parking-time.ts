import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { ParkingTicket } from './parking-ticket';
import { TimeKeeper } from '../time/time-keeper';
import { DateAndTimeInterval } from '../time/interval';

export class ScheduledParkingTime {
  private readonly parkingTimeInterval: DateAndTimeInterval;

  constructor(start: string, end: string) {
    const parkingTimeInterval = TimeKeeper.instance.newDateTimeInterval(
      start,
      end,
    );
    if (!parkingTimeInterval.hasSameDays()) {
      throw new DomainException({
        message: MessageCode.PARKING_TIME_IN_DIFFERENT_DAYS,
      });
    }
    if (parkingTimeInterval.hoursDifference() < 1) {
      throw new DomainException({
        message: MessageCode.MINIMUM_PARKING_TIME_IS_AN_HOUR,
      });
    }
    this.parkingTimeInterval = parkingTimeInterval;
  }

  change(start: string, end: string) {
    return new ScheduledParkingTime(start, end);
  }

  inThePast() {
    return this.parkingTimeInterval.inThePast();
  }

  minutesToStart() {
    return this.parkingTimeInterval.minutesToStart();
  }

  parkingTicket() {
    return new ParkingTicket({
      timeOfEntry: TimeKeeper.instance.dateAndTimeNow().toString(),
      validTo: this.parkingTimeInterval.end().toString(),
    });
  }

  toPlain() {
    const { start, end } = this.parkingTimeInterval.toPlain();
    return {
      start: start.toString(),
      end: end.toString(),
    };
  }
}
