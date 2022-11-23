import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { IdGenerator } from '../../../../src/domain/id';
import { ParkingLotRepository } from '../../../../src/domain/parking-lot/parking-lot.repository';
import { ParkingLotService } from '../../../../src/application/parking-lot/parking-lot.service';
import { randomId } from '../../../misc.util';
import {
  ChangeCapacityCommand,
  ChangeHoursOfOperationCommand,
  CreateParkingLotCommand,
} from '../../../../src/application/parking-lot/parking-lot.command';
import { ParkingLot } from '../../../../src/domain/parking-lot/parking-lot';
import { OperationTimeDays } from '../../../../src/domain/parking-lot/operation-time';
import { MomentInTime } from '../../../../src/domain/time/moment';

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
        hourFrom: 9,
        hourTo: 22,
        days: [OperationTimeDays.MONDAY, OperationTimeDays.TUESDAY],
        validFrom: MomentInTime.nowWithFullHour().jsDate(),
      },
      address: {
        city: 'Warszawa',
        streetNumber: '145',
        streetName: 'Burakowska',
      },
    };

    const { id } = await service.createNewLot(command);

    const [parkingLot] = parkingLotRepositoryMock.save.mock.lastCall;
    const {
      capacity,
      streetName,
      streetNumber,
      city,
      timeOfOperation: { hourFrom, hourTo, validFromDate, operationDays },
    } = parkingLot.plain();
    expect(parkingLot.id).toEqual(parkingLotId);
    expect({ city, streetName, streetNumber }).toEqual(command.address);
    expect(capacity).toEqual(command.capacity);
    expect(id).toEqual(parkingLot.id);
    expect(hourTo).toEqual(command.hoursOfOperation.hourTo);
    expect(hourFrom).toEqual(command.hoursOfOperation.hourFrom);
    expect(validFromDate).toEqual(command.hoursOfOperation.validFrom);
    expect(operationDays).toEqual(command.hoursOfOperation.days);
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
      hourTo: 22,
      hourFrom: 10,
    };
    await service.changeHoursOfOperation(command);
    expect(parkingLotMock.changeOperationHours).toHaveBeenCalledWith({
      hourTo: command.hourTo,
      hourFrom: command.hourFrom,
    });
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
