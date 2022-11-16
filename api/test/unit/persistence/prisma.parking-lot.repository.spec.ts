import { PrismaParkingLotRepository } from '../../../src/persistence/prisma/parking-lot/prisma.parking-lot.repository';
import Mock = jest.Mock;
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { PrismaService } from '../../../src/persistence/prisma/prisma.service';
import { randomId, setUpTimeKeeper } from '../../misc.util';
import { DomainException } from '../../../src/domain/domain.exception';
import { MessageCode } from '../../../src/message';
import { ParkingLot } from '../../../src/domain/parking-lot/parking-lot';
import { Address } from '../../../src/domain/parking-lot/address';

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
          hourFrom: '08:00',
          hourTo: '10:00',
          streetName: 'Sobieskiego',
          streetNumber: '4',
        };
      }
    });

    const parking = await repository.findByIdOrElseThrow(id);

    expect(parking.id).toEqual(id);
    expect(parking.hoursOfOperation.hourTo).toEqual('10:00');
    expect(parking.hoursOfOperation.hourFrom).toEqual('08:00');
    expect(parking.address.streetName).toEqual('Sobieskiego');
    expect(parking.address.streetNumber).toEqual('4');
    expect(parking.address.city).toEqual('Warszawa');
  });
  it('save - upserts parking lot', async () => {
    const id = randomId();
    const parkingLot = new ParkingLot(
      id,
      new Address('Poznan', 'Cybernetyki', '4'),
      100,
      {
        hourFrom: '08:00:00',
        hourTo: '10:00:00',
      },
    );

    await repository.save(parkingLot);

    const expectedUpsertFields = {
      hourFrom: '08:00',
      hourTo: '10:00',
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
