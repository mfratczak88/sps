import { Reservation } from '../../../../src/domain/reservation/reservation';
import { randomId } from '../../../misc.util';
import { ReservationStatus } from '../../../../src/domain/reservation/reservation-status';
import { DateTime } from 'luxon';
import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';
import { createMock } from '@golevelup/ts-jest';
import { ParkingLotAvailability } from '../../../../src/domain/parking-lot-availability';
import { MomentInTime } from '../../../../src/domain/time/moment';

describe('Reservation', () => {
  const timeNowWithHoursShiftedBy = (hours: number) =>
    DateTime.now()
      .set({
        minute: 0,
        second: 0,
        millisecond: 0,
        hour: DateTime.now().hour + hours,
      })
      .toJSDate();

  const reservationWithNoTickets = (args: {
    status: ReservationStatus;
    start: Date;
    end: Date;
  }) => {
    const { status, start, end } = args;
    return new Reservation({
      id: randomId(),
      status: status,
      parkingTickets: [],
      scheduledParkingTime: {
        start: start,
        end: end,
      },
      parkingLotId: randomId(),
      licensePlate: 'WX747JX',
    });
  };
  describe('Confirmation', () => {
    it('throws exception when trying to confirm reservation earlier than 4 hours till scheduled arrival', () => {
      try {
        reservationWithNoTickets({
          status: ReservationStatus.DRAFT,
          start: timeNowWithHoursShiftedBy(24),
          end: timeNowWithHoursShiftedBy(25),
        }).confirm();
        fail();
      } catch (e) {
        expect((e as DomainException).messageProps.messageKey).toEqual(
          MessageCode.RESERVATION_CANNOT_BE_CONFIRMED_YET,
        );
      }
    });
    it('throws exception when trying to confirm reservation if less than 30 minutes is left to the scheduled arrival', () => {
      try {
        reservationWithNoTickets({
          status: ReservationStatus.DRAFT,
          start: timeNowWithHoursShiftedBy(0),
          end: timeNowWithHoursShiftedBy(1),
        }).confirm();
        fail();
      } catch (e) {
        expect((e as DomainException).messageProps.messageKey).toEqual(
          MessageCode.RESERVATION_CANNOT_BE_CONFIRMED_ANYMORE,
        );
      }
    });
    it('throws exception when trying to confirm reservation if it is cancelled', () => {
      try {
        reservationWithNoTickets({
          status: ReservationStatus.CANCELLED,
          start: timeNowWithHoursShiftedBy(10),
          end: timeNowWithHoursShiftedBy(11),
        }).confirm();

        fail();
      } catch (e) {
        expect((e as DomainException).messageProps.messageKey).toEqual(
          MessageCode.RESERVATION_IS_CANCELLED,
        );
      }
    });
    it('throws exception when trying to confirm reservation if is already confirmed', () => {
      try {
        reservationWithNoTickets({
          status: ReservationStatus.CONFIRMED,
          start: timeNowWithHoursShiftedBy(10),
          end: timeNowWithHoursShiftedBy(11),
        }).confirm();
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.RESERVATION_IS_CONFIRMED,
        );
      }
    });
    it('confirming reservation changes the status to CONFIRMED', () => {
      const confirmedReservation = reservationWithNoTickets({
        status: ReservationStatus.CONFIRMED,
        start: timeNowWithHoursShiftedBy(10),
        end: timeNowWithHoursShiftedBy(11),
      });
      expect(confirmedReservation.plain().status).toEqual(
        ReservationStatus.CONFIRMED,
      );
    });
  });
  describe('Cancellation', () => {
    it('throws exception when trying to cancel reservation if its already cancelled', () => {
      try {
        reservationWithNoTickets({
          status: ReservationStatus.CANCELLED,
          start: timeNowWithHoursShiftedBy(10),
          end: timeNowWithHoursShiftedBy(11),
        }).cancel();
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.RESERVATION_IS_CANCELLED,
        );
      }
    });
    it('canceling changes the status to CANCELLED', () => {
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.CONFIRMED,
        start: timeNowWithHoursShiftedBy(10),
        end: timeNowWithHoursShiftedBy(11),
      });

      reservation.cancel();

      const { status } = reservation.plain();
      expect(status).toEqual(ReservationStatus.CANCELLED);
    });
  });
  describe('Time changes', () => {
    it('throws exception when trying to change time if reservation is cancelled', async () => {
      const start = new Date(Date.UTC(2023, 10, 10, 10));
      const end = new Date(Date.UTC(2023, 10, 10, 12));
      const availabilityMock = createMock<ParkingLotAvailability>();
      availabilityMock.placeInLotAvailable.mockResolvedValue(true);

      try {
        await reservationWithNoTickets({
          status: ReservationStatus.CANCELLED,
          start,
          end,
        }).changeTime(
          {
            start: new Date(Date.UTC(2022, 12, 12, 10)),
            end: new Date(Date.UTC(2022, 12, 12, 11)),
          },
          availabilityMock,
        );
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.SCHEDULED_TIME_CANNOT_BE_CHANGED_ANYMORE,
        );
      }
    });
    it('throws exception when trying to change time if there is no free space in the lot with new time', async () => {
      const start = new Date(Date.UTC(2023, 10, 10, 10));
      const end = new Date(Date.UTC(2023, 10, 10, 12));
      const availabilityMock = createMock<ParkingLotAvailability>();
      availabilityMock.placeInLotAvailable.mockResolvedValue(false);

      try {
        await reservationWithNoTickets({
          status: ReservationStatus.DRAFT,
          start,
          end,
        }).changeTime(
          {
            start: new Date(Date.UTC(2022, 12, 12, 10)),
            end: new Date(Date.UTC(2022, 12, 12, 11)),
          },
          availabilityMock,
        );
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.NO_PLACE_IN_LOT,
        );
      }
    });
    it('throws exception when trying to change time if its confirmed', async () => {
      const start = new Date(Date.UTC(2023, 10, 10, 10));
      const end = new Date(Date.UTC(2023, 10, 10, 12));
      const availabilityMock = createMock<ParkingLotAvailability>();
      availabilityMock.placeInLotAvailable.mockResolvedValue(true);

      try {
        await reservationWithNoTickets({
          status: ReservationStatus.CONFIRMED,
          start,
          end,
        }).changeTime(
          {
            start: new Date(Date.UTC(2022, 12, 12, 10)),
            end: new Date(Date.UTC(2022, 12, 12, 11)),
          },
          availabilityMock,
        );
        fail();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.SCHEDULED_TIME_CANNOT_BE_CHANGED_ANYMORE,
        );
      }
    });
    it('changes time of scheduled parking', async () => {
      const availabilityMock = createMock<ParkingLotAvailability>();
      availabilityMock.placeInLotAvailable.mockResolvedValue(true);
      const newStart = new Date(Date.UTC(2022, 12, 12, 10));
      const newEnd = new Date(Date.UTC(2022, 12, 12, 11));
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.DRAFT,
        start: new Date(Date.UTC(2023, 10, 10, 10)),
        end: new Date(Date.UTC(2023, 10, 10, 12)),
      });

      await reservation.changeTime(
        {
          start: newStart,
          end: newEnd,
        },
        availabilityMock,
      );

      const {
        scheduledParkingTime: { start, end },
      } = reservation.plain();

      expect(start).toEqual(newStart);
      expect(end).toEqual(newEnd);
    });
  });
  describe('Issuing parking ticket', () => {
    it('throws exception when trying to issue parking ticket if reservation is in draft', async () => {
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.DRAFT,
        start: MomentInTime.nowWithFullHour().jsDate(),
        end: timeNowWithHoursShiftedBy(2),
      });
      try {
        reservation.issueParkingTicket();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.RESERVATION_NEEDS_TO_BE_CONFIRMED_FIRST,
        );
      }
    });
    it('throws exception when trying to issue parking ticket if reservation is cancelled', async () => {
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.CANCELLED,
        start: MomentInTime.nowWithFullHour().jsDate(),
        end: timeNowWithHoursShiftedBy(2),
      });
      try {
        reservation.issueParkingTicket();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.RESERVATION_IS_CANCELLED,
        );
      }
    });
    it('throws exception when trying to issue parking ticket if previous ticket was not returned', () => {
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.CONFIRMED,
        start: MomentInTime.nowWithFullHour().jsDate(),
        end: timeNowWithHoursShiftedBy(2),
      });
      reservation.issueParkingTicket();
      try {
        reservation.issueParkingTicket();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.PREVIOUS_TICKET_NOT_RETURNED,
        );
      }
    });
    it('issues parking ticket with validTo equals parking time end date', () => {
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.CONFIRMED,
        start: MomentInTime.nowWithFullHour().jsDate(),
        end: timeNowWithHoursShiftedBy(2),
      });
      reservation.issueParkingTicket();

      const {
        parkingTickets,
        scheduledParkingTime: { end },
      } = reservation.plain();
      expect(parkingTickets[0].validTo).toEqual(end);
    });
  });
  describe('Returning parking ticket', () => {
    it('throws exception when trying to return non existing ticket', () => {
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.CONFIRMED,
        start: MomentInTime.nowWithFullHour().jsDate(),
        end: timeNowWithHoursShiftedBy(2),
      });
      try {
        reservation.returnParkingTicket();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.TICKET_NOT_FOUND,
        );
      }
    });
    it('throws exception when trying to return ticket already returned', () => {
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.CONFIRMED,
        start: MomentInTime.nowWithFullHour().jsDate(),
        end: timeNowWithHoursShiftedBy(2),
      });
      reservation.issueParkingTicket();
      reservation.returnParkingTicket();

      try {
        // at this point 1 was issued and 1 was returned -> no ticket due for return
        reservation.returnParkingTicket();
      } catch (err) {
        expect((err as DomainException).messageProps.messageKey).toEqual(
          MessageCode.TICKET_NOT_FOUND,
        );
      }
    });
    it('returns parking ticket', () => {
      const start = MomentInTime.nowWithFullHour().jsDate();
      const end = timeNowWithHoursShiftedBy(2);
      const reservation = reservationWithNoTickets({
        status: ReservationStatus.CONFIRMED,
        start,
        end,
      });
      reservation.issueParkingTicket();
      reservation.returnParkingTicket();

      const { parkingTickets } = reservation.plain();
      const [parkingTicket] = parkingTickets;
      expect(parkingTickets.length).toEqual(1);
      expect(parkingTicket.validTo).toEqual(end);
      expect(parkingTicket.timeOfLeave).toBeDefined();
    });
  });
});
