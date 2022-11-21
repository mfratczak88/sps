import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { ParkingTicket } from './parking-ticket';

import { PeriodOfTime } from '../time/period';
import { MomentInTime } from '../time/moment';

export class ScheduledParkingTime {
  private readonly parkingTime: PeriodOfTime;

  constructor(start: Date, end: Date) {
    const parkingTime = new PeriodOfTime(start, end);
    if (!parkingTime.start().isFullHour() || !parkingTime.end().isFullHour()) {
      throw new DomainException({
        message: MessageCode.PARKING_TIME_HOUR_MUST_BE_FULL,
      });
    }
    if (!parkingTime.hasSameDays()) {
      throw new DomainException({
        message: MessageCode.PARKING_TIME_IN_DIFFERENT_DAYS,
      });
    }
    if (parkingTime.hoursDifference() < 1) {
      throw new DomainException({
        message: MessageCode.MINIMUM_PARKING_TIME_IS_AN_HOUR,
      });
    }
    this.parkingTime = parkingTime;
  }

  change(start: Date, end: Date) {
    return new ScheduledParkingTime(start, end);
  }

  minutesToStart() {
    return this.parkingTime.minutesToStart();
  }

  parkingTicket() {
    if (this.minutesToStart() > 5) {
      throw new DomainException({
        message: MessageCode.TOO_EARLY_TO_ISSUE_PARKING_TICKET,
      });
    }
    if (this.parkingEndInThePast()) {
      throw new DomainException({
        message: MessageCode.TICKET_CANNOT_BE_ISSUED_ANYMORE,
      });
    }
    if (!this.startsToday()) {
      throw new DomainException({
        message: MessageCode.RESERVED_PARKING_TIME_IN_THE_PAST,
      });
    }
    return new ParkingTicket({
      timeOfEntry: MomentInTime.now(),
      validTo: this.parkingTime.end(),
    });
  }

  private startsToday() {
    return this.parkingTime.start().hasSameDay(MomentInTime.now());
  }

  private parkingEndInThePast() {
    return this.parkingTime.end().isBefore(MomentInTime.now());
  }

  plain() {
    return {
      start: this.parkingTime.start().jsDate(),
      end: this.parkingTime.end().jsDate(),
    };
  }
}
