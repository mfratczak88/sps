import { PrismaDriverRepository } from '../../../src/persistence/prisma/prisma.driver.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import Mock = jest.Mock;
import { PrismaService } from '../../../src/persistence/prisma/prisma.service';
import { randomId } from '../../misc.util';
import { DomainException } from '../../../src/domain/domain.exception';
import { MessageCode } from '../../../src/message';
import { Driver } from '../../../src/domain/driver';

describe('Prisma driver repository', () => {
  let driverRepo: PrismaDriverRepository;
  let userFindFirst: Mock;
  let parkingLotsFindMany: Mock;
  let userUpdate: Mock;
  let prismaServiceMock: DeepMocked<PrismaService>;
  beforeEach(() => {
    userFindFirst = jest.fn();
    parkingLotsFindMany = jest.fn();
    userUpdate = jest.fn();
    prismaServiceMock = createMock<PrismaService>({
      user: {
        findFirst: userFindFirst,
        update: userUpdate,
      },
      parkingLot: {
        findMany: parkingLotsFindMany,
      },
    });
    driverRepo = new PrismaDriverRepository(prismaServiceMock);
  });
  it('find by id -  throws exception when user does not exist', async () => {
    const userId = randomId();
    userFindFirst.mockImplementation(async (id) => userId === id && undefined);
    try {
      await driverRepo.findByIdOrThrow(userId);
      fail();
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.DRIVER_DOES_NOT_EXIST,
      );
    }
  });
  it('returns driver with its vehicles and assigned parking lots', async () => {
    const driverId = randomId();
    userFindFirst.mockImplementation(async (query) => {
      if (query.where.id === driverId)
        return {
          id: driverId,
          vehicles: [{ licensePlate: '3' }, { licensePlate: '4' }],
          parkingLots: [{ id: '4' }],
        };
    });

    const driver = await driverRepo.findByIdOrThrow(driverId);

    expect(driver.id).toEqual(driverId);
    expect(
      ['3', '4'].every((licensePlate) =>
        driver.vehicles.map((v) => v.licensePlate).includes(licensePlate),
      ),
    ).toEqual(true);
    expect(driver.assignedParkingLots[0]).toEqual('4');
  });
  it('save - throws exception when parking lots does not exist', async () => {
    const driver = new Driver('3', [{ licensePlate: '4' }], ['3', '4']);
    parkingLotsFindMany.mockImplementation(() => [{ id: '3' }]);
    try {
      await driverRepo.save(driver);
    } catch (err) {
      expect(err instanceof DomainException);
      expect((err as DomainException).messageProps.messageKey).toEqual(
        MessageCode.PARKING_LOT_DOES_NOT_EXIST,
      );
      expect((err as DomainException).messageProps.args).toEqual({
        lotId: '4',
      });
    }
  });
  it('save - saves driver together with their parking lots and vehicles', async () => {
    const parkingLots = [{ id: '3' }, { id: '4' }];
    const licensePlateConnectOrCreate = [
      { create: { licensePlate: '4' }, where: { licensePlate: '4' } },
    ];
    const driver = new Driver('3', [{ licensePlate: '4' }], ['3', '4']);
    parkingLotsFindMany.mockImplementation(() => parkingLots);

    await driverRepo.save(driver);

    const [{ where, data }] = userUpdate.mock.lastCall;
    expect(where).toEqual({ id: '3' });
    expect(data).toEqual({
      parkingLots: { set: [{ id: '3' }, { id: '4' }] },
      vehicles: { connectOrCreate: [...licensePlateConnectOrCreate] },
    });
  });
});
