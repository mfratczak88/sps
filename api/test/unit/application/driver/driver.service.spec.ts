import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { DriverRepository } from '../../../../src/domain/driver.repository';
import { DriverService } from '../../../../src/application/driver/driver.service';
import { randomId } from '../../../misc.util';
import { Driver } from '../../../../src/domain/driver';
import {
  AddVehicleCommand,
  AssignParkingLotCommand,
  RemoveParkingLotAssignmentCommand,
} from '../../../../src/application/driver/driver.command';

describe('driver service', function () {
  let repoMock: DeepMocked<DriverRepository>;
  let service: DriverService;

  beforeEach(() => {
    repoMock = createMock<DriverRepository>();
    service = new DriverService(repoMock);
  });
  it('adds driver vehicle', async () => {
    const driverId = randomId();
    const licensePlate = randomId();
    const driverMock = createMock<Driver>();
    const command: AddVehicleCommand = {
      driverId,
      licensePlate,
    };
    repoMock.findByIdOrThrow.mockImplementation(async (id) => {
      if (id === driverId) return driverMock;
    });
    await service.addVehicle(command);

    const [actualLicensePlate] = driverMock.addVehicle.mock.lastCall;
    expect(actualLicensePlate).toEqual(licensePlate);
    expect(repoMock.save).toHaveBeenCalledWith(driverMock);
  });
  it('assigns parking lot', async () => {
    const driverId = randomId();
    const parkingLotId = randomId();
    const driverMock = createMock<Driver>();
    const command: AssignParkingLotCommand = {
      driverId,
      parkingLotId,
    };
    repoMock.findByIdOrThrow.mockImplementation(async (id) => {
      if (id === driverId) return driverMock;
    });
    await service.assignParkingLot(command);

    const [actualParkingLotId] = driverMock.assignParkingLot.mock.lastCall;
    expect(actualParkingLotId).toEqual(parkingLotId);
    expect(repoMock.save).toHaveBeenCalledWith(driverMock);
  });
  it('removes parking lot assignment', async () => {
    const driverId = randomId();
    const parkingLotId = randomId();
    const driverMock = createMock<Driver>();
    const command: RemoveParkingLotAssignmentCommand = {
      driverId,
      parkingLotId,
    };
    repoMock.findByIdOrThrow.mockImplementation(async (id) => {
      if (id === driverId) return driverMock;
    });
    await service.removeParkingLotAssignment(command);

    const [actualParkingLotId] = driverMock.removeLotAssignment.mock.lastCall;
    expect(actualParkingLotId).toEqual(parkingLotId);
    expect(repoMock.save).toHaveBeenCalledWith(driverMock);
  });
});
