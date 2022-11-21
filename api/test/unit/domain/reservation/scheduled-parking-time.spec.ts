import { ScheduledParkingTime } from '../../../../src/domain/reservation/scheduled-parking-time';
import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';
import { DateTime } from 'luxon';
import { approxTheSameTime } from '../../../misc.util';

describe('Scheduled parking time', () => {
  describe('Change', () => {
    it('on change returns new object', () => {
      const newStart = new Date(Date.UTC(2022, 12, 13, 10));
      const newEnd = new Date(Date.UTC(2022, 12, 13, 19));

      const scheduledParkingTime = new ScheduledParkingTime(
        new Date(Date.UTC(2022, 12, 12, 10)),
        new Date(Date.UTC(2022, 12, 12, 19)),
      ).change(newStart, newEnd);

      const { start, end } = scheduledParkingTime.plain();
      expect(start).toEqual(newStart);
      expect(end).toEqual(newEnd);
    });
  });
  describe('Construction', () => {
    it('on construction throws exception when parking time start is not full hour', () => {
      const start = new Date(Date.UTC(2022, 10, 10, 10, 30));
      const end = new Date(Date.UTC(2022, 10, 10, 18, 0));
      try {
        new ScheduledParkingTime(start, end);
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.PARKING_TIME_HOUR_MUST_BE_FULL,
        );
      }
    });
    it('on construction throws exception when parking time end is not a full hour', () => {
      const start = new Date(Date.UTC(2022, 10, 10, 10, 0));
      const end = new Date(Date.UTC(2022, 10, 10, 18, 30));
      try {
        new ScheduledParkingTime(start, end);
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.PARKING_TIME_HOUR_MUST_BE_FULL,
        );
      }
    });
    it('on construction throws exception when parking time is not in the same day', () => {
      const start = new Date(Date.UTC(2022, 10, 10, 10, 0));
      const end = new Date(Date.UTC(2022, 10, 20, 18, 0));
      try {
        new ScheduledParkingTime(start, end);
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.PARKING_TIME_IN_DIFFERENT_DAYS,
        );
      }
    });
    it('on construction throws exception when parking time is less than one hour', () => {
      const start = new Date(Date.UTC(2022, 10, 10, 10, 0));
      const end = new Date(Date.UTC(2022, 10, 10, 10, 20));
      try {
        new ScheduledParkingTime(start, end);
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.PARKING_TIME_HOUR_MUST_BE_FULL,
        );
      }
    });
  });
  describe('Creating parking ticket', () => {
    it('throws exception when trying to create ticket earlier than 5 minutes before schedule', () => {
      const now = DateTime.now().set({ minute: 0, second: 0, millisecond: 0 });
      const start = now.set({ hour: now.hour - 1 }).toJSDate();
      const end = now.set({ hour: now.hour + 2 }).toJSDate();
      try {
        new ScheduledParkingTime(start, end);
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.TOO_EARLY_TO_ISSUE_PARKING_TICKET,
        );
      }
    });
    it('throws exception when trying to create ticket for already ended parking period', () => {
      const start = new Date(Date.UTC(2022, 10, 10, 10));
      const end = new Date(Date.UTC(2022, 10, 10, 11));
      try {
        new ScheduledParkingTime(start, end).parkingTicket();
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.TICKET_CANNOT_BE_ISSUED_ANYMORE,
        );
      }
    });
    it('creates parking ticket with current time as time of entry and validTo = scheduled time end', () => {
      const now = DateTime.now().set({
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      const start = now.toJSDate();
      const end = now.set({ hour: now.hour + 2 }).toJSDate();
      const parkingTicket = new ScheduledParkingTime(
        start,
        end,
      ).parkingTicket();

      const { timeOfEntry, timeOfLeave, validTo } = parkingTicket.plain();
      expect(timeOfLeave).toBeFalsy();
      expect(validTo).toEqual(end);
      expect(approxTheSameTime(timeOfEntry, DateTime.now().toJSDate())).toEqual(
        true,
      );
    });
  });
});
