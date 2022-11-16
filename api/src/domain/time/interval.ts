import { MomentInTime } from './moment';

interface Interval {
  equal(start: string, end: string): boolean;

  toPlain(): IntervalPlain;

  start(): MomentInTime;

  end(): MomentInTime;
}

export type TimeInterval = Interval;

export interface DateAndTimeInterval extends Interval {
  hasSameDays(): boolean;

  minutesToStart(): number;

  inThePast(): boolean;

  hoursDifference(): number;
}

export interface IntervalPlain {
  start: MomentInTime;
  end: MomentInTime;
}
