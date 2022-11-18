import { DateTime } from 'luxon';
import { DomainException } from '../domain.exception';
import { MessageCode } from '../../message';

export class MomentInTime {
  private readonly dateTime: DateTime;
  constructor(date: Date) {
    const dateTime = DateTime.fromJSDate(date).toUTC();
    if (!dateTime.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_MOMENT_IN_TIME,
      });
    }
    this.dateTime = dateTime;
  }

  isBefore(momentInTime: MomentInTime) {
    return (
      this.dateTime.diff(momentInTime.dateTime).toObject().milliseconds > 0
    );
  }

  jsDate() {
    return this.dateTime.toJSDate();
  }

  equals(momentInTimeImpl: MomentInTime) {
    return this.dateTime.equals(momentInTimeImpl.dateTime);
  }

  minutesDiff(other: MomentInTime) {
    return this.dateTime.diff(other.dateTime, 'minutes').minutes;
  }

  isFullHour() {
    return (
      this.dateTime.minute === 0 &&
      this.dateTime.minute === 0 &&
      this.dateTime.millisecond === 0
    );
  }

  static now() {
    return new MomentInTime(DateTime.now().toJSDate());
  }

  static nowWithFullHour() {
    return new MomentInTime(
      DateTime.now().set({ minute: 0, second: 0, millisecond: 0 }).toJSDate(),
    );
  }
}
