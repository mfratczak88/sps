import { ParkingLot, HoursOfOperation } from '../../../src/domain/parking-lot';
import { randomId } from '../../misc.util';
import { Address } from '../../../src/domain/address';
import { DomainException } from '../../../src/domain/domain.exception';
import { MessageCode } from '../../../src/message';

describe('Parking lot', () => {
  it('Throws domain exception when new parking capacity is less than or equal to 0', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      { hourFrom: 8, hourTo: 24 },
    );
    try {
      parkingLot.changeCapacity(-10);
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.NON_POSITIVE_LOT_CAPACITY,
      );
    }
    try {
      parkingLot.changeCapacity(0);
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.NON_POSITIVE_LOT_CAPACITY,
      );
    }
  });
  it('Throws domain exception when new parking capacity is the same as the old one', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      { hourFrom: 8, hourTo: 24 },
    );
    try {
      parkingLot.changeCapacity(100);
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.SAME_CAPACITY,
      );
    }
  });

  it('Assigns new capacity', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      { hourFrom: 8, hourTo: 24 },
    );

    parkingLot.changeCapacity(150);
    expect(parkingLot.hasCapacity(150)).toEqual(true);
  });

  it('throws domain exception when operation hour from is less than 0 or greater than 24', () => {
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        { hourFrom: -3, hourTo: 24 },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_HOURS,
      );
    }
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        { hourFrom: 28, hourTo: 24 },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_HOURS,
      );
    }
  });
  it('throws domain exception when operation hour to is less than 0 or greater than 24', () => {
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        { hourFrom: 2, hourTo: -2 },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_HOURS,
      );
    }
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        { hourFrom: 2, hourTo: 2434 },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_HOURS,
      );
    }
  });
  it('Changes operation hours', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      { hourFrom: 7, hourTo: 15 },
    );
    const newHours: HoursOfOperation = {
      hourTo: 16,
      hourFrom: 8,
    };

    parkingLot.changeOperationHours(newHours);

    expect(parkingLot.open(newHours)).toEqual(true);
  });
});
