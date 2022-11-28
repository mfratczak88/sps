import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ReservationRepository } from '../../../../../src/domain/reservation/reservation.repository';
import { DriverRepository } from '../../../../../src/domain/driver/driver.repository';
import { Reservation } from '../../../../../src/domain/reservation/reservation';
import { ReservationAuthorizationService } from '../../../../../src/infrastructure/security/authorization/reservation.authorization.service';
import { UserService } from '../../../../../src/infrastructure/security/user/user.service';
import { User } from '../../../../../src/infrastructure/security/user/user';
import { randomId } from '../../../../misc.util';
import { Role } from '../../../../../src/infrastructure/security/authorization/role';
import { ReservationStatus } from '../../../../../src/domain/reservation/reservation-status';
import { Driver } from '../../../../../src/domain/driver/driver';
import { Vehicle } from '../../../../../src/domain/driver/vehicle';
import { Id } from '../../../../../src/domain/id';

describe('Reservation authorization service', () => {
  let reservationRepoMock: DeepMocked<ReservationRepository>;
  let userServiceMock: DeepMocked<UserService>;
  let driverRepositoryMock: DeepMocked<DriverRepository>;
  let reservationAuthorizationService: ReservationAuthorizationService;

  const plainReservationMockFor = (
    licensePlate: string,
    reservationId: string,
  ) => ({
    id: reservationId,
    licensePlate,
    parkingLotId: randomId(),
    status: ReservationStatus.CONFIRMED,
    parkingTickets: [],
    scheduledParkingTime: {
      start: new Date(),
      end: new Date(),
    },
  });
  const mockDriverWithVehicleOnPlate = (licensePlate: string) =>
    new Driver(randomId(), [new Vehicle(licensePlate)], []);

  const mockReturnedDriver = (mockDriver: Driver) => {
    driverRepositoryMock.findByIdOrThrow.mockImplementation(
      async (id) => id === mockDriver.id && mockDriver,
    );
  };
  const mockReturnedReservation = (id: Id, mock: Reservation) => {
    reservationRepoMock.findByIdOrThrow.mockImplementation(
      async (id) => id === id && mock,
    );
  };
  beforeEach(() => {
    reservationRepoMock = createMock();
    userServiceMock = createMock();
    driverRepositoryMock = createMock();
    reservationAuthorizationService = new ReservationAuthorizationService(
      reservationRepoMock,
      userServiceMock,
      driverRepositoryMock,
    );
  });

  it('allows to create reservation if user is driver', async () => {
    const userId = randomId();
    const userStub: Partial<User> = {
      role: Role.DRIVER,
      id: userId,
    };
    userServiceMock.findById.mockImplementation(
      async (id) => id === userId && (userStub as User),
    );
    const canCreateReservation =
      await reservationAuthorizationService.canCreateReservation(userId);

    expect(canCreateReservation).toBe(true);
  });
  it('does not allow to create reservation if user is not dirver', async () => {
    const userId = randomId();
    const userStub: Partial<User> = {
      role: Role.ADMIN,
      id: userId,
    };
    userServiceMock.findById.mockImplementation(
      async (id) => id === userId && (userStub as User),
    );
    const canCreateReservation =
      await reservationAuthorizationService.canCreateReservation(userId);

    expect(canCreateReservation).toBe(false);
  });
  it('allows to confirm reservation if reservation is for user vehicle', async () => {
    const reservationId = randomId();
    const licensePlate = 'WI747HG';
    const reservationMock = createMock<Reservation>();
    reservationMock.plain.mockReturnValue(
      plainReservationMockFor(licensePlate, reservationId),
    );
    const mockDriver = mockDriverWithVehicleOnPlate(licensePlate);

    mockReturnedDriver(mockDriver);
    mockReturnedReservation(reservationId, reservationMock);

    const canConfirm =
      await reservationAuthorizationService.canConfirmReservation(
        mockDriver.id,
        reservationId,
      );

    expect(canConfirm).toEqual(true);
  });
  it('allows to cancel reservation if reservation is for users vehicle', async () => {
    const reservationId = randomId();
    const licensePlate = 'WI747HG';
    const reservationMock = createMock<Reservation>();
    reservationMock.plain.mockReturnValue(
      plainReservationMockFor(licensePlate, reservationId),
    );
    const mockDriver = mockDriverWithVehicleOnPlate(licensePlate);

    mockReturnedDriver(mockDriver);
    mockReturnedReservation(reservationId, reservationMock);
    const canCancel =
      await reservationAuthorizationService.canCancelReservation(
        mockDriver.id,
        reservationId,
      );

    expect(canCancel).toEqual(true);
  });
  it('allows to change time of reservation if reservation is for users vehicle', async () => {
    const reservationId = randomId();
    const licensePlate = 'WI747HG';
    const reservationMock = createMock<Reservation>();
    reservationMock.plain.mockReturnValue(
      plainReservationMockFor(licensePlate, reservationId),
    );
    const mockDriver = mockDriverWithVehicleOnPlate(licensePlate);

    mockReturnedDriver(mockDriver);
    mockReturnedReservation(reservationId, reservationMock);
    const can =
      await reservationAuthorizationService.canChangeTimeOfReservation(
        mockDriver.id,
        reservationId,
      );

    expect(can).toEqual(true);
  });
  it('allows to return parking ticket reservation if user is a clerk', async () => {
    const userId = randomId();
    const userStub: Partial<User> = {
      role: Role.CLERK,
      id: userId,
    };
    userServiceMock.findById.mockImplementation(
      async (id) => id === userId && (userStub as User),
    );

    const can = await reservationAuthorizationService.canReturnParkingTicket(
      userId,
    );

    expect(can).toEqual(true);
  });
  it('allows to issue parking ticket reservation if user is a clerk', async () => {
    const userId = randomId();
    const userStub: Partial<User> = {
      role: Role.CLERK,
      id: userId,
    };
    userServiceMock.findById.mockImplementation(
      async (id) => id === userId && (userStub as User),
    );

    const can = await reservationAuthorizationService.canReturnParkingTicket(
      userId,
    );

    expect(can).toEqual(true);
  });
});
