import { PrismaParkingLotRepository } from '../../../src/persistence/prisma/parking-lot/prisma.parking-lot.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { PrismaService } from '../../../src/persistence/prisma/prisma.service';
import { randomId, setUpTimeKeeper } from '../../misc.util';
import { DomainException } from '../../../src/domain/domain.exception';
import { MessageCode } from '../../../src/message';
import { ParkingLot } from '../../../src/domain/parking-lot/parking-lot';
import { Address } from '../../../src/domain/parking-lot/address';
import {
  OperationTime,
  OperationTimeDays,
} from '../../../src/domain/parking-lot/operation-time';
import Mock = jest.Mock;

describe('Parking lot repository', () => {
  let repository: PrismaParkingLotRepository;
  let findById: Mock;
  let upsert: Mock;
  let prismaService: DeepMocked<PrismaService>;
  beforeAll(setUpTimeKeeper);
  beforeEach(() => {
    findById = jest.fn();
    upsert = jest.fn();
    prismaService = createMock<PrismaService>({
      parkingLot: {
        findFirst: findById,
        upsert,
      },
    });
    repository = new PrismaParkingLotRepository(prismaService);
  });
  it('find by id - throws if does not exist', async () => {
    findById.mockImplementation(() => undefined);
    try {
      await repository.findByIdOrElseThrow(randomId());
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.PARKING_LOT_DOES_NOT_EXIST,
      );
    }
  });
  it('find by id - returns domain object', async () => {
    const id = randomId();

    findById.mockImplementation((query) => {
      if (query.where.id === id) {
        return {
          id,
          city: 'Warszawa',
          capacity: 100,
          operationTimeRule: new OperationTime(10, 22, [
            OperationTimeDays.WEDNESDAY,
          ]).plain().rrule,
          streetName: 'Sobieskiego',
          streetNumber: '4',
        };
      }
    });

    const parking = await repository.findByIdOrElseThrow(id);
    const {
      city,
      capacity,
      streetNumber,
      streetName,
      timeOfOperation: { hourFrom, hourTo, operationDays },
    } = parking.plain();
    expect(parking.id).toEqual(id);
    expect(streetName).toEqual('Sobieskiego');
    expect(streetNumber).toEqual('4');
    expect(city).toEqual('Warszawa');
    expect(capacity).toEqual(100);
    expect(hourFrom).toEqual(10);
    expect(hourTo).toEqual(22);
    expect(operationDays).toEqual([OperationTimeDays.WEDNESDAY]);
  });
  it('save - upserts parking lot', async () => {
    const id = randomId();
    const operationTime = new OperationTime(10, 22, [
      OperationTimeDays.WEDNESDAY,
    ]);
    const parkingLot = new ParkingLot(
      id,
      new Address('Poznan', 'Cybernetyki', '4'),
      100,
      operationTime,
    );

    await repository.save(parkingLot);

    const expectedUpsertFields = {
      operationTimeRule: operationTime.plain().rrule,
      city: 'Poznan',
      capacity: 100,
      streetName: 'Cybernetyki',
      streetNumber: '4',
    };
    const [{ where, update, create }] = upsert.mock.lastCall;

    expect(where.id).toEqual(id);
    expect(update).toEqual(expectedUpsertFields);
    expect(create).toEqual({ id, ...expectedUpsertFields });
  });
});
