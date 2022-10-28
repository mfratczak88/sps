import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { IdGenerator } from '../../../../src/domain/id';
import { ParkingLotRepository } from '../../../../src/domain/parking-lot.repository';
import { ParkingLotService } from '../../../../src/application/parking-lot/parking-lot.service';
import { randomId } from '../../../misc.util';
import {
  ChangeCapacityCommand,
  ChangeHoursOfOperationCommand,
  CreateParkingLotCommand,
} from '../../../../src/application/parking-lot/parking-lot.command';
import { ParkingLot } from '../../../../src/domain/parking-lot';

describe('Parking lot service', () => {
  let idGeneratorMock: DeepMocked<IdGenerator>;
  let parkingLotRepositoryMock: DeepMocked<ParkingLotRepository>;
  let service: ParkingLotService;
  beforeEach(() => {
    idGeneratorMock = createMock<IdGenerator>();
    parkingLotRepositoryMock = createMock<ParkingLotRepository>();
    service = new ParkingLotService(idGeneratorMock, parkingLotRepositoryMock);
  });

  it('saves new parking lot', async () => {
    const parkingLotId = randomId();
    idGeneratorMock.generate.mockResolvedValue(parkingLotId);
    const command: CreateParkingLotCommand = {
      capacity: 100,
      hoursOfOperation: {
        hourFrom: '08:00',
        hourTo: '10:00',
      },
      address: {
        city: 'Warszawa',
        streetNumber: '145',
        streetName: 'Burakowska',
      },
    };

    const { id } = await service.createNewLot(command);

    const [parkingLot] = parkingLotRepositoryMock.save.mock.lastCall;
    expect(parkingLot.id).toEqual(parkingLotId);
    expect(parkingLot.address).toEqual(command.address);
    expect(parkingLot.hoursOfOperation).toEqual(command.hoursOfOperation);
    expect(parkingLot.capacity).toEqual(command.capacity);
    expect(id).toEqual(parkingLot.id);
  });
  it('changes parking lot hours of operation', async () => {
    const parkingLotMock = createMock<ParkingLot>();
    const parkingLotId = randomId();
    parkingLotRepositoryMock.findByIdOrElseThrow.mockImplementation(
      async (id) => {
        if (id === parkingLotId) {
          return parkingLotMock;
        }
      },
    );
    const command: ChangeHoursOfOperationCommand = {
      parkingLotId,
      hoursOfOperation: {
        hourFrom: '08:00',
        hourTo: '10:00',
      },
    };
    await service.changeHoursOfOperation(command);
    expect(parkingLotMock.changeOperationHours).toHaveBeenCalledWith(
      command.hoursOfOperation,
    );
    expect(parkingLotRepositoryMock.save).toHaveBeenCalledWith(parkingLotMock);
  });
  it('changes parking lot capacity', async () => {
    const parkingLotMock = createMock<ParkingLot>();
    const parkingLotId = randomId();
    parkingLotRepositoryMock.findByIdOrElseThrow.mockImplementation(
      async (id) => {
        if (id === parkingLotId) {
          return parkingLotMock;
        }
      },
    );
    const command: ChangeCapacityCommand = {
      parkingLotId,
      capacity: 300,
    };
    await service.changeCapacity(command);
    expect(parkingLotMock.changeCapacity).toHaveBeenCalledWith(300);
    expect(parkingLotRepositoryMock.save).toHaveBeenCalledWith(parkingLotMock);
  });
});
