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

  inThePast() {
    return this.parkingTime.inThePast();
  }

  minutesToStart() {
    return this.parkingTime.minutesToStart();
  }

  parkingTicket() {
    return new ParkingTicket({
      timeOfEntry: MomentInTime.now(),
      validTo: this.parkingTime.end(),
    });
  }
}
