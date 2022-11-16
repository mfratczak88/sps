import { TimeInterval } from '../time/interval';
import { TimeKeeper } from '../time/time-keeper';

export interface OperationHoursPlain {
  hourFrom: string;
  hourTo: string;
}
export class OperationHours {
  private readonly period: TimeInterval;
  constructor({ hourFrom, hourTo }: OperationHoursPlain) {
    this.period = TimeKeeper.instance.newTimeInterval(hourFrom, hourTo);
  }

  change(hours: OperationHoursPlain) {
    return new OperationHours(hours);
  }

  equal({ hourFrom, hourTo }: OperationHoursPlain) {
    return this.period.equal(hourFrom, hourTo);
  }

  toPlain(): OperationHoursPlain {
    const { start, end } = this.period.toPlain();
    return {
      hourFrom: start.toString(),
      hourTo: end.toString(),
    };
  }
}
