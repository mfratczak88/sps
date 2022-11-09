import { PeriodOfTime, toHoursAndMinutes } from '../period-of-time';

export interface OperationHoursPlain {
  hourFrom: string;
  hourTo: string;
}
export class OperationHours {
  private readonly period: PeriodOfTime;
  constructor({ hourFrom, hourTo }: OperationHoursPlain) {
    this.period = new PeriodOfTime(hourFrom, hourTo);
  }

  change(hours: OperationHoursPlain) {
    return new OperationHours(hours);
  }

  equal({ hourFrom, hourTo }: OperationHoursPlain) {
    return this.period.equal(hourFrom, hourTo);
  }

  toPlain(): OperationHoursPlain {
    return {
      hourFrom: toHoursAndMinutes(this.period.start),
      hourTo: toHoursAndMinutes(this.period.end),
    };
  }
}
