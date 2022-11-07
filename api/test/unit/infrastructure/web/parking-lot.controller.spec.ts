import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ParkingLotService } from '../../../../src/application/parking-lot/parking-lot.service';
import { ParkingLotFinder } from '../../../../src/application/parking-lot/parking-lot.finder';
import { ParkingLotController } from '../../../../src/infrastructure/web/parking-lot.controller';
import {
  ChangeCapacityCommand,
  ChangeHoursOfOperationCommand,
  CreateParkingLotCommand,
} from '../../../../src/application/parking-lot/parking-lot.command';
import { randomId } from '../../../misc.util';

describe('Parking lot controller', () => {
  let parkingLotService: DeepMocked<ParkingLotService>;
  let parkingLotFinder: DeepMocked<ParkingLotFinder>;
  let parkingLotController: ParkingLotController;
  beforeEach(() => {
    parkingLotFinder = createMock<ParkingLotFinder>();
    parkingLotService = createMock<ParkingLotService>();

    parkingLotController = new ParkingLotController(
      parkingLotService,
      parkingLotFinder,
    );
  });
  it('Delegates create new lot command to parking lot service', async () => {
    const command = createMock<CreateParkingLotCommand>();

    await parkingLotController.createParkingLot(command);

    expect(parkingLotService.createNewLot).toHaveBeenCalledWith(command);
  });
  it('Delegates change hours of operation command to parking lot service with parking lot param from url', async () => {
    const command = createMock<ChangeHoursOfOperationCommand>();
    const parkingLotId = randomId();

    await parkingLotController.changeHoursOfOperation(parkingLotId, command);

    expect(parkingLotService.changeHoursOfOperation).toHaveBeenCalledWith({
      ...command,
      parkingLotId,
    });
  });
  it('Delegates change parking lot capacity command to parking lot service with parking lot param from url', async () => {
    const command = createMock<ChangeCapacityCommand>();
    const parkingLotId = randomId();

    await parkingLotController.changeCapacity(parkingLotId, command);

    expect(parkingLotService.changeCapacity).toHaveBeenCalledWith({
      ...command,
      parkingLotId,
    });
  });
});
