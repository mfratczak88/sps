import { ParkingLot } from '../../../src/domain/parking-lot';
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
    );

    parkingLot.changeCapacity(150);
    expect(parkingLot.hasCapacity(150)).toEqual(true);
  });
});
