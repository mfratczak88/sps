import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { PrismaService } from '../../../../../src/persistence/prisma/prisma.service';
import {
  PrismaDriver,
  PrismaDriverFinder,
} from '../../../../../src/persistence/prisma/driver/prisma.driver.finder';
import {
  DriverQuery,
  TimeHorizon,
} from '../../../../../src/application/driver/driver.read-model';
import { randomId } from '../../../../misc.util';
import { Role } from '../../../../../src/infrastructure/security/authorization/role';
import { ReservationStatus } from '../../../../../src/domain/reservation/reservation-status';
import { PrismaReservationFinder } from '../../../../../src/persistence/prisma/reservation/prisma.reservation.finder';

describe('Prisma driver finder', () => {
  let prismaServiceMock: DeepMocked<PrismaService>;
  let finder: PrismaDriverFinder;
  let findFirstMock: jest.Mock;
  let findManyReservationsMock: jest.Mock;
  let findManyDriversMock: jest.Mock;
  let findVehiclesMock: jest.Mock;
  const driverSelect = {
    select: {
      id: true,
      email: true,
      name: true,
      parkingLots: {
        select: {
          id: true,
        },
      },
      vehicles: {
        select: {
          licensePlate: true,
        },
      },
    },
  };
  const mockDriver = (id: string): PrismaDriver => ({
    id: id,
    email: 'alex@gmail.com',
    name: 'Alex',
    parkingLots: [{ id: '1' }, { id: '2' }],
    vehicles: [{ licensePlate: 'WI747HG' }],
  });
  beforeEach(() => {
    findFirstMock = jest.fn();
    findManyReservationsMock = jest.fn();
    findManyDriversMock = jest.fn();
    findVehiclesMock = jest.fn();
    prismaServiceMock = createMock<PrismaService>({
      user: {
        findFirst: findFirstMock,
        findMany: findManyDriversMock,
      },
      reservation: {
        findMany: findManyReservationsMock,
      },
      vehicle: {
        findMany: findVehiclesMock,
      },
    });
    finder = new PrismaDriverFinder(prismaServiceMock);
  });
  describe('Find single', () => {
    it('selects user by id and role together with fields', async () => {
      const query: DriverQuery = { timeHorizon: undefined };
      const driverId = randomId();
      const foundPrismaDriver = mockDriver(driverId);
      findFirstMock.mockResolvedValue(foundPrismaDriver);
      await finder.findSingle(driverId, query);

      expect(findFirstMock).toHaveBeenCalledWith({
        where: {
          id: driverId,
          role: Role.DRIVER,
        },
        ...driverSelect,
      });
    });
    it('loads due next reservations', async () => {
      const query: DriverQuery = { timeHorizon: [TimeHorizon.DUE_NEXT] };
      const driverId = randomId();
      const foundPrismaDriver = mockDriver(driverId);
      findFirstMock.mockResolvedValue(foundPrismaDriver);
      findManyReservationsMock.mockResolvedValue([]);

      await finder.findSingle(driverId, query);

      const [
        {
          where: { status, vehicle },
          select,
        },
      ] = findManyReservationsMock.mock.lastCall;
      expect(status).toEqual({ not: ReservationStatus.CANCELLED });
      expect(vehicle).toEqual({ user: { id: driverId } });
      expect(select).toEqual(PrismaReservationFinder.selectClause);
    });
    it('loads pending action reservations', async () => {
      const query: DriverQuery = { timeHorizon: [TimeHorizon.PENDING_ACTION] };
      const driverId = randomId();
      const foundPrismaDriver = mockDriver(driverId);
      findFirstMock.mockResolvedValue(foundPrismaDriver);
      findManyReservationsMock.mockResolvedValue([]);

      await finder.findSingle(driverId, query);

      const [
        {
          where: { status, vehicle },
          select,
        },
      ] = findManyReservationsMock.mock.lastCall;
      expect(status).toEqual(ReservationStatus.DRAFT);
      expect(vehicle).toEqual({ user: { id: driverId } });
      expect(select).toEqual(PrismaReservationFinder.selectClause);
    });
    it('loads ongoing reservations', async () => {
      const query: DriverQuery = { timeHorizon: [TimeHorizon.PENDING_ACTION] };
      const driverId = randomId();
      const foundPrismaDriver = mockDriver(driverId);
      findFirstMock.mockResolvedValue(foundPrismaDriver);
      findManyReservationsMock.mockResolvedValue([]);

      await finder.findSingle(driverId, query);

      const [
        {
          where: { status, vehicle },
          select,
        },
      ] = findManyReservationsMock.mock.lastCall;
      expect(status).toEqual(ReservationStatus.DRAFT);
      expect(vehicle).toEqual({ user: { id: driverId } });
      expect(select).toEqual(PrismaReservationFinder.selectClause);
    });
    it('returns null if not found in DB', async () => {
      findFirstMock.mockResolvedValue(null);

      expect(await finder.findSingle(randomId(), {})).toEqual(null);
    });
  });
  describe('Find all vehicles', () => {
    it('calls prisma service', async () => {
      findVehiclesMock.mockResolvedValue([]);

      await finder.findAllVehicles();

      expect(findVehiclesMock).toHaveBeenCalled();
    });
  });
  describe('Find all', () => {
    it('fetches users with role driver and selects correct fields', async () => {
      findManyDriversMock.mockResolvedValue([]);

      await finder.findAll();

      expect(findManyDriversMock).toHaveBeenCalledWith({
        where: {
          role: Role.DRIVER,
        },
        ...driverSelect,
      });
    });
  });
});
