import { MomentInTime } from '../../../domain/time/moment';
import { DateTime } from 'luxon';
import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';

export class PrismaTime implements MomentInTime {
  private readonly dateTime: DateTime;
  constructor(time: string) {
    const dateTime = DateTime.fromSQL(time);
    if (!dateTime.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_TIME,
      });
    }
    this.dateTime = dateTime;
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
    return new PrismaTime(luxonToSql(DateTime.now()));
  }

  static fromLuxonDateTime(dateTime: DateTime) {
    return new PrismaTime(luxonToSqlTime(dateTime));
  }
}
export class PrismaDateAndTime implements MomentInTime {
  private readonly dateTime: DateTime;
  constructor(dateTime: string) {
    const luxonDateTime = DateTime.fromSQL(dateTime);
    if (!luxonDateTime.isValid) {
      throw new DomainException({
        message: MessageCode.INVALID_DATE_TIME,
      });
    }
    this.dateTime = luxonDateTime;
  }
  toString(): string {
    return this.dateTime.toSQL({
      includeOffset: false,
    });
  }

  static now() {
    return new PrismaDateAndTime(luxonToSql(DateTime.now()));
  }

  static fromLuxonDateTime(dateTime: DateTime) {
    return new PrismaTime(luxonToSql(dateTime));
  }
}
const luxonToSql = (dateTime: DateTime) =>
  dateTime.toSQL({ includeOffset: false });
const luxonToSqlTime = (dateTime: DateTime) =>
  dateTime.toSQLTime({ includeOffset: false });
export const jsDateToString = (d: Date) =>
  d && luxonToSql(DateTime.fromJSDate(d));
export const stringToJsDate = (s: string) => DateTime.fromSQL(s).toJSDate();
