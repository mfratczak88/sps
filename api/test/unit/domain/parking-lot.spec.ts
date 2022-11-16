import { ParkingLot } from '../../../src/domain/parking-lot/parking-lot';
import { randomId, setUpTimeKeeper } from '../../misc.util';
import { Address } from '../../../src/domain/parking-lot/address';
import { DomainException } from '../../../src/domain/domain.exception';
import { MessageCode } from '../../../src/message';
import { OperationHoursPlain } from '../../../src/domain/parking-lot/operation-hours';

describe('Parking lot', () => {
  beforeEach(setUpTimeKeeper);
  it('Throws domain exception when new parking capacity is less than or equal to 0', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      { hourFrom: '08:00:00', hourTo: '10:00:00' },
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
      { hourFrom: '08:00:00', hourTo: '10:00:00' },
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
      { hourFrom: '08:00:00', hourTo: '10:00:00' },
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
        { hourFrom: '28:00:00', hourTo: '10:00:00' },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_DATE_TIME_INTERVAL,
      );
    }
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        { hourFrom: '-08:00:00', hourTo: '10:00:00' },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_DATE_TIME_INTERVAL,
      );
    }
  });
  it('throws domain exception when operation hour to is invalid', () => {
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        { hourFrom: '08:00:00', hourTo: '1000:00:00' },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_DATE_TIME_INTERVAL,
      );
    }
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        { hourFrom: '08:00:00', hourTo: '222:00:00' },
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_DATE_TIME_INTERVAL,
      );
    }
  });
  it('Changes operation hours', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      { hourFrom: '08:00:00', hourTo: '19:00:00' },
    );
    const newHours: OperationHoursPlain = {
      hourFrom: '10:00:00',
      hourTo: '20:00:00',
    };

    parkingLot.changeOperationHours(newHours);

    expect(parkingLot.open(newHours)).toEqual(true);
  });
});
