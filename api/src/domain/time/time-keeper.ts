import { MomentInTime } from './moment';
import { DateAndTimeInterval, TimeInterval } from './interval';

export abstract class TimeKeeper {
  abstract newTimeInterval(start: string, end: string): TimeInterval;

  abstract newDateTimeInterval(start: string, end: string): DateAndTimeInterval;

  abstract timeNow(): MomentInTime;

  abstract dateAndTimeNow(): MomentInTime;

  abstract timeFromString(time: string): MomentInTime;

  abstract dateAndTimeFromString(dateAndTime: string): MomentInTime;

  static instance: TimeKeeper;
}
