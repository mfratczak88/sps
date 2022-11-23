import { ParkingTicket } from '../../../../src/domain/reservation/parking-ticket';
import { MomentInTime } from '../../../../src/domain/time/moment';
import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';
import { DateTime } from 'luxon';

describe('Parking ticket', () => {
  it('Returning more than one time throws an exception', () => {
    const timeOfEntry = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 10, 0, 0)),
    );
    const validTo = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 18, 0, 0)),
    );

    const parkingTicket = new ParkingTicket({ validTo, timeOfEntry });
    parkingTicket.return();
    try {
      parkingTicket.return();
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.CANNOT_RETURN_TICKET_TWICE,
      );
    }
  });
  it('Throws domain exception when validTo is before timeOfEntry', () => {
    const timeOfEntry = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 10, 0, 0)),
    );
    const validTo = new MomentInTime(new Date(Date.UTC(2020, 10, 10, 9, 0, 0)));
    try {
      new ParkingTicket({ validTo, timeOfEntry });
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_PARKING_TICKET_TIMES,
      );
    }
  });
  it('Throws domain exception when timeOfLeave is before timeOfEntry', () => {
    const timeOfEntry = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 10, 0, 0)),
    );
    const validTo = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 18, 0, 0)),
    );
    const timeOfLeave = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 6, 0, 0)),
    );
    try {
      new ParkingTicket({ validTo, timeOfEntry, timeOfLeave });
      fail();
    } catch (err) {
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_PARKING_TICKET_TIMES,
      );
    }
  });
  it('returned ticket gets current time as timeOfLeave', () => {
    const timeOfEntry = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 10, 0, 0)),
    );
    const validTo = new MomentInTime(
      new Date(Date.UTC(2020, 10, 10, 18, 0, 0)),
    );

    const ticket = new ParkingTicket({ validTo, timeOfEntry });
    const now = new Date(Date.now());
    ticket.return();
    const { timeOfLeave } = ticket.plain();
    expect(
      DateTime.fromJSDate(now)
        .diff(DateTime.fromJSDate(timeOfLeave))
        .as('second'),
    ).toBeLessThan(1);
  });
});
