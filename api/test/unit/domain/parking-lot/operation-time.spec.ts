import {
  OperationTime,
  OperationTimeDays,
} from '../../../../src/domain/parking-lot/operation-time';
import { MomentInTime } from '../../../../src/domain/time/moment';
import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';
import { DateTime } from 'luxon';

describe('Operation time', () => {
  const dateWithHour = (hour) =>
    new MomentInTime(
      DateTime.fromSQL('2022-11-21 ' + hour).toJSDate(),
    ).jsDate();
  it('Should not allow valid from time to have not full hour', () => {
    try {
      new OperationTime(
        10,
        22,
        [OperationTimeDays.WEDNESDAY],
        MomentInTime.now().jsDate(),
      );
      fail();
    } catch (e) {
      expect(e).toBeInstanceOf(DomainException);
      expect((e as DomainException).messageProps.messageKey).toEqual(
        MessageCode.HOURS_OF_OPERATION_VALID_FROM_NOT_FULL_HOUR,
      );
    }
  });
  it('should default to current time with full hour if validFrom is not given on construction', () => {
    const operationTime = new OperationTime(10, 22, [
      OperationTimeDays.WEDNESDAY,
    ]);
    expect(operationTime.plain().validFromDate).toEqual(
      MomentInTime.nowWithFullHour().jsDate(),
    );
  });
  it('Should throw domain exception when hours are invalid', () => {
    try {
      new OperationTime(-100, 22, [OperationTimeDays.WEDNESDAY]);
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_LOT_HOURS_OF_OPERATION,
      );
    }
  });
  it('Should throw domain exception when days are empty', () => {
    try {
      new OperationTime(10, 22, []);
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_OPERATION_TIME_DAYS,
      );
    }
  });
  it('Should throw domain exception when days are invalid', () => {
    try {
      new OperationTime(10, 22, [12]);
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_OPERATION_TIME_DAYS,
      );
    }
  });
  it('Should throw domain exception when rrule is invalid', () => {
    try {
      OperationTime.fromRRule('foooooo');
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_LOT_HOURS_OF_OPERATION,
      );
    }
  });
  it('should return true on checking parking time if parking time hours count equals operation hours slot', () => {
    const operationTime = new OperationTime(10, 22, [OperationTimeDays.MONDAY]);
    const parkingTimeStart = dateWithHour('10:00');
    const parkingTimeEnd = dateWithHour('22:00');

    expect(
      operationTime.withinOperationHours(parkingTimeStart, parkingTimeEnd),
    ).toEqual(true);
  });
  it('should return true on checking parking time if parking time hours count is less than operation hours slot', () => {
    const operationTime = new OperationTime(10, 22, [OperationTimeDays.MONDAY]);
    const parkingTimeStart = dateWithHour('10:00');
    const parkingTimeEnd = dateWithHour('12:00');

    expect(
      operationTime.withinOperationHours(parkingTimeStart, parkingTimeEnd),
    ).toEqual(true);
  });
  it('should return false on checking parking time if parking time hours exceeds hours of operation', () => {
    const operationTime = new OperationTime(10, 22, [OperationTimeDays.MONDAY]);
    const parkingTimeStart = dateWithHour('10:00');
    const parkingTimeEnd = dateWithHour('23:00');

    expect(
      operationTime.withinOperationHours(parkingTimeStart, parkingTimeEnd),
    ).toEqual(false);
  });
  it('should return false on checking parking time if parking time is before starting date of the lot', () => {
    const operationTime = new OperationTime(
      10,
      22,
      [OperationTimeDays.MONDAY],
      new MomentInTime(
        DateTime.fromSQL('2023-03-06 10:00').toJSDate(),
      ).jsDate(),
    );
    const parkingTimeStart = dateWithHour('10:00');
    const parkingTimeEnd = dateWithHour('12:00');

    expect(
      operationTime.withinOperationHours(parkingTimeStart, parkingTimeEnd),
    ).toEqual(false);
  });
  it('should return false on checking parking time when parking time start is before hours of operation', () => {
    const operationTime = new OperationTime(10, 22, [OperationTimeDays.MONDAY]);
    const parkingTimeStart = dateWithHour('07:00');
    const parkingTimeEnd = dateWithHour('15:00');

    expect(
      operationTime.withinOperationHours(parkingTimeStart, parkingTimeEnd),
    ).toEqual(false);
  });

  it('on hours change should change only hours and rrule leaving days and validFrom the same', () => {
    const operationTimeBefore = new OperationTime(10, 22, [
      OperationTimeDays.MONDAY,
    ]);

    const operationTimeAfterHoursChange = operationTimeBefore.changeHours({
      hourFrom: 11,
      hourTo: 20,
    });

    const {
      validFromDate: validFromBefore,
      operationDays: operationDaysBefore,
    } = operationTimeBefore.plain();
    const {
      hourTo: hourToAfter,
      hourFrom: hourFromAfter,
      validFromDate: validFromAfter,
      operationDays: operationDaysAfter,
    } = operationTimeAfterHoursChange.plain();

    expect(hourFromAfter).toEqual(11);
    expect(hourToAfter).toEqual(20);
    expect(validFromAfter).toEqual(validFromBefore);
    expect(operationDaysAfter).toEqual(operationDaysBefore);
  });
  it('should be able to reconstruct object from rrule', () => {
    const operationTime = new OperationTime(10, 22, [OperationTimeDays.MONDAY]);
    const { rrule } = operationTime.plain();

    expect(OperationTime.fromRRule(rrule).plain()).toEqual(
      operationTime.plain(),
    );
  });
});
