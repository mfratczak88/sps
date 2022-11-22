import { ParkingLot } from '../../../../src/domain/parking-lot/parking-lot';
import { randomId } from '../../../misc.util';
import { Address } from '../../../../src/domain/parking-lot/address';
import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';
import {
  OperationTime,
  OperationTimeDays,
} from '../../../../src/domain/parking-lot/operation-time';

describe('Parking lot', () => {
  it('Throws domain exception when new parking capacity is less than or equal to 0', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      new OperationTime(10, 22, [
        OperationTimeDays.MONDAY,
        OperationTimeDays.TUESDAY,
      ]),
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
      new OperationTime(10, 22, [
        OperationTimeDays.MONDAY,
        OperationTimeDays.TUESDAY,
      ]),
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
      new OperationTime(10, 22, [
        OperationTimeDays.MONDAY,
        OperationTimeDays.TUESDAY,
      ]),
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
        new OperationTime(-2, 22, [
          OperationTimeDays.MONDAY,
          OperationTimeDays.TUESDAY,
        ]),
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_LOT_HOURS_OF_OPERATION,
      );
    }
    try {
      new ParkingLot(
        randomId(),
        new Address('Warszawa', 'Sobieskiego', '4'),
        100,
        new OperationTime(6, 28, [
          OperationTimeDays.MONDAY,
          OperationTimeDays.TUESDAY,
        ]),
      );
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_LOT_HOURS_OF_OPERATION,
      );
    }
  });

  it('Changes operation hours', () => {
    const parkingLot = new ParkingLot(
      randomId(),
      new Address('Warszawa', 'Sobieskiego', '4'),
      100,
      new OperationTime(6, 22, [
        OperationTimeDays.MONDAY,
        OperationTimeDays.TUESDAY,
      ]),
    );

    parkingLot.changeOperationHours({ hourFrom: 8, hourTo: 10 });
    const {
      timeOfOperation: { hourFrom, hourTo },
    } = parkingLot.plain();
    expect(hourFrom).toEqual(8);
    expect(hourTo).toEqual(10);
  });
});
