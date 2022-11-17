import { Driver } from '../../../../src/domain/driver/driver';
import { randomId, setUpTimeKeeper } from '../../../misc.util';
import { Vehicle } from '../../../../src/domain/driver/vehicle';
import { DomainException } from '../../../../src/domain/domain.exception';
import { MessageCode } from '../../../../src/message';

describe('Driver spec', () => {
  beforeEach(setUpTimeKeeper);
  it('Throws exception when adding vehicles which is already assigned to a driver', () => {
    const licensePlate = 'CT331GJX';
    const driver = new Driver(randomId(), [new Vehicle(licensePlate)], []);
    try {
      driver.addVehicle(licensePlate);
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.VEHICLE_ALREADY_REGISTERED,
      );
    }
  });

  it('Assigns new parking lot if not assigned yet', () => {
    const driver = new Driver(randomId(), [], []);
    const parkingLotId = randomId();
    driver.assignParkingLot(parkingLotId);
    expect(driver.isParkingLotAssigned(parkingLotId)).toEqual(true);
  });
  it('removes assignment of the parking lot if exists', () => {
    const parkingLotId = randomId();
    const driver = new Driver(randomId(), [], [parkingLotId]);
    driver.removeLotAssignment(parkingLotId);
    expect(driver.isParkingLotAssigned(parkingLotId)).toEqual(false);
  });
  it('Throws when trying to assign already assigned parking lot', () => {
    try {
      const parkingLotId = randomId();
      const driver = new Driver(randomId(), [], [parkingLotId]);
      driver.assignParkingLot(parkingLotId);
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.PARKING_LOT_ALREADY_ASSIGNED_TO_DRIVER,
      );
    }
  });
  it('throws domain exception when trying to remove non assigned parking lot', () => {
    try {
      const parkingLotId = randomId();
      const driver = new Driver(randomId(), [], []);
      driver.removeLotAssignment(parkingLotId);
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.PARKING_LOT_NOT_ASSIGNED_TO_DRIVER,
      );
    }
  });
});
