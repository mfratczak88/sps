import {
  DateAndTimeInterval,
  TimeInterval,
} from '../../../domain/time/interval';
import { MomentInTime } from '../../../domain/time/moment';
import { DateTime, Interval } from 'luxon';
import { PrismaDateAndTime, PrismaTime } from './prisma.moment';
import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';

const luxonIntervalFromStrings = (start: string, end: string) =>
  Interval.fromDateTimes(DateTime.fromSQL(start), DateTime.fromSQL(end));

abstract class PrismaInterval {
  protected interval: Interval;
  protected constructor(start: string, end: string) {
    const interval = luxonIntervalFromStrings(start, end);
    if (!interval.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_DATE_TIME_INTERVAL,
      });
    }
    this.interval = interval;
  }

  abstract start(): MomentInTime;
  abstract end(): MomentInTime;

  toPlain() {
    return {
      start: this.start(),
      end: this.end(),
    };
  }
}

export class PrismaTimeInterval extends PrismaInterval implements TimeInterval {
  constructor(start: string, end: string) {
    super(start, end);
  }

  end(): MomentInTime {
    return PrismaTime.fromLuxonDateTime(this.interval.end);
  }

  equal(start: string, end: string): boolean {
    const other = luxonIntervalFromStrings(start, end);
    return (
      other.start.hasSame(this.interval.start, 'hour') &&
      other.end.hasSame(this.interval.end, 'minute')
    );
  }

  start(): MomentInTime {
    return PrismaTime.fromLuxonDateTime(this.interval.start);
  }

  toPlain(): { start: MomentInTime; end: MomentInTime } {
    return super.toPlain();
  }
}
export class PrismaDateInterval
  extends PrismaInterval
  implements DateAndTimeInterval
{
  constructor(start: string, end: string) {
    super(start, end);
  }

  equal(start: string, end: string): boolean {
    const other = luxonIntervalFromStrings(start, end);
    return other.equals(this.interval);
  }

  hasSameDays(): boolean {
    return this.interval.start.hasSame(this.interval.end, 'day');
  }

  inThePast(): boolean {
    return this.interval.isBefore(DateTime.now());
  }

  minutesToStart(): number {
    const now = DateTime.now();
    return this.interval.start.diff(now, 'minute').minutes;
  }

  hoursDifference(): number {
    return this.interval.length('hours');
  }

  end(): MomentInTime {
    return PrismaDateAndTime.fromLuxonDateTime(this.interval.end);
  }

  start(): MomentInTime {
    return PrismaDateAndTime.fromLuxonDateTime(this.interval.start);
  }

  toPlain(): { start: MomentInTime; end: MomentInTime } {
    return super.toPlain();
  }
}
