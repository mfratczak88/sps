import { MomentInTime } from '../../../domain/time/moment';
import { DateTime } from 'luxon';
import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';

class MomentInTimeImpl implements MomentInTime {
  readonly dateTime: DateTime;
  constructor(time: string) {
    this.dateTime = DateTime.fromSQL(time);
  }

  isBefore(other: MomentInTime): boolean {
    return (
      this.dateTime.diff((other as MomentInTimeImpl).dateTime).toObject()
        .milliseconds < 0
    );
  }
}
export class PrismaTime extends MomentInTimeImpl {
  constructor(time: string) {
    super(time);
    if (!this.dateTime.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_TIME,
      });
    }
  }

  toString(): string {
    const [hours, minutes] = this.dateTime
      .toSQLTime({
        includeOffset: false,
      })
      .split('.')[0]
      .split(':');
    return `${hours}:${minutes}`;
  }

  static now() {
    return PrismaTime.fromLuxonDateTime(DateTime.now());
  }

  static fromLuxonDateTime(dateTime: DateTime) {
    return new PrismaTime(PrismaTime.luxonToSqlTime(dateTime));
  }

  private static luxonToSqlTime = (dateTime: DateTime) =>
    dateTime.toSQLTime({ includeOffset: false });
}

export class PrismaDateAndTime extends MomentInTimeImpl {
  constructor(dateTime: string) {
    super(dateTime);
    if (!this.dateTime.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_DATE_TIME,
      });
    }
  }

  toString(): string {
    return this.dateTime.toSQL({
      includeOffset: false,
    });
  }

  static now() {
    return PrismaDateAndTime.fromLuxonDateTime(DateTime.now());
  }

  static fromLuxonDateTime(dateTime: DateTime) {
    return new PrismaTime(PrismaDateAndTime.luxonToSql(dateTime));
  }

  private static luxonToSql = (dateTime: DateTime) =>
    dateTime.toSQL({ includeOffset: false });

  static fromJsDate(d: Date) {
    return PrismaDateAndTime.luxonToSql(DateTime.fromJSDate(d));
  }

  toJsDate() {
    return this.dateTime.toJSDate();
  }
}
