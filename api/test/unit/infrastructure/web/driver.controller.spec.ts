import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { DriverService } from '../../../../src/application/driver/driver.service';
import { DriverFinder } from '../../../../src/application/driver/driver.finder';
import { DriverController } from '../../../../src/infrastructure/web/driver.controller';
import {
  AddVehicleCommand,
  AssignParkingLotCommand,
} from '../../../../src/application/driver/driver.command';
import { randomId } from '../../../misc.util';

describe('Driver controller', () => {
  let driverServiceMock: DeepMocked<DriverService>;
  let finderMock: DeepMocked<DriverFinder>;
  let driverController: DriverController;
  beforeEach(() => {
    driverServiceMock = createMock<DriverService>();
    finderMock = createMock<DriverFinder>();
    driverController = new DriverController(driverServiceMock, finderMock);
  });
  it('Delegates call to finder to find all drivers', async () => {
    await driverController.getAllDrivers();

    expect(finderMock.findAll).toHaveBeenCalled();
  });
  it('Delegates add vehicle command to driver service with driver id from param', async () => {
    const driverId = '1234';
    const command = createMock<AddVehicleCommand>();

    await driverController.addVehicle(driverId, command);

    expect(driverServiceMock.addVehicle).toHaveBeenCalledWith({
      ...command,
      driverId,
    });
  });
  it('Delegates assign parking lot command to service with driverId from param', async () => {
    const command = createMock<AssignParkingLotCommand>();
    const driverId = randomId();
    await driverController.addParkingLot(driverId, command);

    expect(driverServiceMock.assignParkingLot).toHaveBeenCalledWith({
      ...command,
      driverId,
    });
  });
  it('Delegates remove parking lot assignment command to service with driverId and lot idfrom param ', async () => {
    const driverId = randomId();
    const parkingLotId = randomId();

    await driverController.removeParkingLotAssignment(driverId, parkingLotId);

    expect(driverServiceMock.removeParkingLotAssignment).toHaveBeenCalledWith({
      parkingLotId,
      driverId,
    });
  });
});
