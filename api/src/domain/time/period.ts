import { DateTime, Interval } from 'luxon';
import { MomentInTime } from './moment';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';

export class PeriodOfTime {
  private readonly interval: Interval;
  private readonly startMoment: MomentInTime;
  private readonly endMoment: MomentInTime;

  constructor(start: Date, end: Date) {
    this.startMoment = new MomentInTime(start);
    this.endMoment = new MomentInTime(end);
    const interval = Interval.fromDateTimes(
      DateTime.fromJSDate(this.startMoment.jsDate()),
      DateTime.fromJSDate(this.endMoment.jsDate()),
    );
    if (!interval.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_TIME_PERIOD,
      });
    }
    this.interval = interval;
  }

  equal(start: Date, end: Date): boolean {
    return (
      this.startMoment.equals(new MomentInTime(start)) &&
      this.endMoment.equals(new MomentInTime(end))
    );
  }

  start(): MomentInTime {
    return this.startMoment;
  }

  end(): MomentInTime {
    return this.endMoment;
  }

  hasSameDays(): boolean {
    return this.interval.hasSame('day');
  }

  minutesToStart(): number {
    return this.startMoment.minutesDiff(MomentInTime.now());
  }

  inThePast(): boolean {
    return this.startMoment.minutesDiff(MomentInTime.now()) < 0;
  }

  hoursDifference(): number {
    return this.interval.length('hours');
  }
}
