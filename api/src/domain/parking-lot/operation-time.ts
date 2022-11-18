import { PeriodOfTime } from '../time/period';
import { RRule, Weekday } from 'rrule';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';
import { MomentInTime } from '../time/moment';

export class OperationTime {
  private readonly hourFrom: number;
  private readonly hourTo: number;
  private readonly validFromDate: MomentInTime;
  private readonly rrule: RRule;
  private readonly days: OperationTimeDays[];

  constructor(
    hourFrom: number,
    hourTo: number,
    days: OperationTimeDays[],
    validFromDate?: Date,
  ) {
    const validFromMoment = validFromDate
      ? new MomentInTime(validFromDate)
      : MomentInTime.nowWithFullHour();

    if (!validFromMoment.isFullHour()) {
      throw new DomainException({
        message: MessageCode.HOURS_OF_OPERATION_VALID_FROM_NOT_FULL_HOUR,
      });
    }
    if (hourFrom >= hourTo) {
      throw new DomainException({
        message: MessageCode.INVALID_LOT_HOURS_OF_OPERATION,
      });
    }

    this.hourFrom = hourFrom;
    this.hourTo = hourTo;
    this.days = days;
    this.validFromDate = validFromMoment;
    this.rrule = this.buildRRule(days);
  }

  withinStartAndEndDate(start: Date, end: Date) {
    const periodOfTime = new PeriodOfTime(start, end);
    return (
      periodOfTime.hoursDifference() ===
      this.rrule.between(start, end, true).length
    );
  }

  changeHours({ hourFrom, hourTo }: OperationHours) {
    return new OperationTime(
      hourFrom,
      hourTo,
      this.days,
      this.validFromDate.jsDate(),
    );
  }

  plain() {
    return {
      hourFrom: this.hourFrom,
      hourTo: this.hourTo,
      validFromDate: this.validFromDate.jsDate(),
      operationDays: this.days,
      rrule: this.rrule.toString(),
    };
  }

  static fromRRule(rrule: string) {
    const rule = RRule.fromString(rrule);
    const hourFrom = rule.options.byhour[0];
    const hourTo = rule.options.byhour[rule.options.byhour.length - 1];
    const days = rule.options.byweekday;
    const startFromDate = rule.options.dtstart;
    return new OperationTime(hourFrom, hourTo, days, startFromDate);
  }

  private buildRRule(operationDays: OperationTimeDays[]) {
    try {
      return new RRule({
        freq: RRule.HOURLY,
        dtstart: this.validFromDate.jsDate(),
        interval: 1,
        byweekday: operationDays.map((d) => new Weekday(d)),
        byhour: [...new Array(this.hourTo - this.hourFrom).keys()].map(
          (idx) => idx + this.hourFrom,
        ),
      });
    } catch (e) {
      console.log(e);
      throw new DomainException({
        message: MessageCode.INVALID_DATE_TIME,
      });
    }
  }
}

export interface OperationHours {
  hourFrom: number;
  hourTo: number;
}

export enum OperationTimeDays {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}
