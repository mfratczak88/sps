import { DriverFinder } from '../../../../../src/application/driver/driver.finder';
import { VehiclesController } from '../../../../../src/infrastructure/web/controller/vehicles.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('Vehicles controller', () => {
  let finderMock: DeepMocked<DriverFinder>;
  let controller: VehiclesController;
  beforeEach(() => {
    finderMock = createMock<DriverFinder>();
    controller = new VehiclesController(finderMock);
  });
  describe('Find all', () => {
    it('calls finder', async () => {
      await controller.findAll();
      expect(finderMock.findAllVehicles).toHaveBeenCalled();
    });
  });
});
