import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/persistence/prisma/prisma.service';
import { User } from '../../src/infrastructure/security/user/user';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {
  authCookie,
  authenticateUser,
  createAdminUser,
  createDummyParkingLot,
  csrfTokenHeader,
  setUpNestApp,
} from './e2e-test.util';
import { changeUserRole, clear } from '../db.util';
import * as request from 'supertest';
import {
  ChangeCapacityCommand,
  ChangeHoursOfOperationCommand,
  CreateParkingLotCommand,
} from '../../src/application/parking-lot/parking-lot.command';
import { Role } from '../../src/infrastructure/security/authorization/role';
import { randomId } from '../misc.util';

describe('Parking lot e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminUser: User;
  let csrfTokenCookie: string[];
  let loginCookies: string[];
  let csrfToken: string;
  const baseUrl = '/parking-lots';

  const validCreateParkingLotCommand: CreateParkingLotCommand = {
    capacity: 4,
    hoursOfOperation: {
      minuteTo: 0,
      hourFrom: 2,
      hourTo: 22,
      minuteFrom: 0,
    },
    address: {
      streetName: 'Maczka',
      streetNumber: '4',
      city: 'Warszawa',
    },
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await setUpNestApp(moduleRef);
    prismaService = moduleRef.get(PrismaService);
    await clear(prismaService);
    adminUser = await createAdminUser(app, prismaService);
  });
  beforeEach(async () => {
    const { email, password } = adminUser;
    ({ csrfTokenCookie, csrfToken, loginCookies } = await authenticateUser(
      email,
      password,
      app,
    ));
    prismaService.parkingLot.deleteMany();
    await changeUserRole(prismaService, adminUser.id, Role.ADMIN);
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Create parking lot', () => {
    it('Creates parking lot and returns 201', async () => {
      const { capacity, hoursOfOperation, address } =
        validCreateParkingLotCommand;
      const response = await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send(validCreateParkingLotCommand);

      const { id } = response.body;

      const { id: savedParkingLotId, ...lotData } =
        await prismaService.parkingLot.findFirst({
          where: {
            id,
          },
        });
      expect(lotData).toEqual({
        capacity,
        ...address,
        ...hoursOfOperation,
      });
      expect(savedParkingLotId).toEqual(id);
    });
    it('Returns 400 if address is empty', async () => {
      const { capacity, hoursOfOperation } = validCreateParkingLotCommand;
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          capacity,
          hoursOfOperation,
        })
        .expect(400);
    });
    it('Returns 400 if operation hours are empty', async () => {
      const { capacity, address } = validCreateParkingLotCommand;
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({ capacity, address })
        .expect(400);
    });
    it('Returns 400 if operation hours are invalid', async () => {
      const { capacity, address, hoursOfOperation } =
        validCreateParkingLotCommand;
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          capacity,
          address,
          hoursOfOperation: { ...hoursOfOperation, hourTo: -4 },
        })
        .expect(400);
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          capacity,
          address,
          hoursOfOperation: { ...hoursOfOperation, hourFrom: -4 },
        })
        .expect(400);
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          capacity,
          address,
          hoursOfOperation: { ...hoursOfOperation, hourTo: 28 },
        })
        .expect(400);
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          capacity,
          address,
          hoursOfOperation: { ...hoursOfOperation, hourFrom: 28 },
        })
        .expect(400);
    });
    it('Returns 400 if capacity is negative', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          ...validCreateParkingLotCommand,
          capacity: -4,
        })
        .expect(400);
    });
    it('Returns 403 if user is not admin', async () => {
      await changeUserRole(prismaService, adminUser.id, Role.CLERK);
      const { email, password } = adminUser;
      const { csrfTokenCookie, csrfToken, loginCookies } =
        await authenticateUser(email, password, app);
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          ...validCreateParkingLotCommand,
        })
        .expect(403);
    });
    it('Returns 401 if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .send({
          ...validCreateParkingLotCommand,
        })
        .expect(401);
    });
    it('Returns 403 if CSRF token is missing', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .send({
          ...validCreateParkingLotCommand,
        })
        .expect(403);
    });
    it('Returns 403 if CSRF token is invalid', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader('someInvalidToken'))
        .send({
          ...validCreateParkingLotCommand,
        })
        .expect(403);
    });
  });
  describe('Change operation hours', () => {
    const parkingLotId = randomId();
    const changeOperationHoursUri = 'hoursOfOperation';
    const validChangeHoursCommand: ChangeHoursOfOperationCommand = {
      parkingLotId,
      hoursOfOperation: {
        hourFrom: 9,
        minuteFrom: 0,
        minuteTo: 0,
        hourTo: 10,
      },
    };
    beforeAll(async () => {
      await createDummyParkingLot(parkingLotId, prismaService);
    });
    beforeEach(async () => {
      await changeUserRole(prismaService, adminUser.id, Role.ADMIN);
    });
    it('Returns 400 is parkingLotId is empty', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeOperationHoursUri}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          ...validChangeHoursCommand,
          parkingLotId: undefined,
        })
        .expect(400);
    });
    it('Returns 400 if parkingLot does not exist', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${randomId()}/${changeOperationHoursUri}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          ...validChangeHoursCommand,
          parkingLotId: randomId(),
        })
        .expect(400);
    });
    it('Returns 400 if hours are invalid', async () => {
      const { parkingLotId, hoursOfOperation } = validChangeHoursCommand;
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeOperationHoursUri}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          parkingLotId,
          hoursOfOperation: {
            ...hoursOfOperation,
            hourFrom: 9,
            hourTo: -3,
          },
        })
        .expect(400);
    });
    it('Returns 401 if user is not authenticated', async () => {
      const { parkingLotId } = validChangeHoursCommand;
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeOperationHoursUri}`)
        .send(validChangeHoursCommand)
        .expect(401);
    });
    it('Returns 403 if user is not admin', async () => {
      await changeUserRole(prismaService, adminUser.id, Role.CLERK);
      const { email, password } = adminUser;
      const { csrfTokenCookie, csrfToken, loginCookies } =
        await authenticateUser(email, password, app);
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeOperationHoursUri}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send(validChangeHoursCommand)
        .expect(403);
    });
    it('Returns 403 if CSRF token is missing', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeOperationHoursUri}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .send(validChangeHoursCommand)
        .expect(403);
    });
    it('Returns 403 if CSRF token is invalid', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeOperationHoursUri}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader('INVALID'))
        .send(validChangeHoursCommand)
        .expect(403);
    });
    it('Changes operation hours and returns 204', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeOperationHoursUri}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send(validChangeHoursCommand)
        .expect(204);

      const { hourFrom, hourTo, minuteFrom, minuteTo } =
        await prismaService.parkingLot.findFirst({
          where: {
            id: parkingLotId,
          },
        });

      expect({ hourFrom, hourTo, minuteFrom, minuteTo }).toEqual(
        validChangeHoursCommand.hoursOfOperation,
      );
    });
  });
  describe('Change capacity', () => {
    const parkingLotId = randomId();
    const changeCapacityURI = 'capacity';
    const validChangeCapacityCommand: ChangeCapacityCommand = {
      capacity: 2,
      parkingLotId: parkingLotId,
    };
    beforeAll(async () => {
      await createDummyParkingLot(parkingLotId, prismaService);
    });
    beforeEach(async () => {
      await changeUserRole(prismaService, adminUser.id, Role.ADMIN);
    });
    it('Returns 400 is parkingLotId is empty', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          ...validChangeCapacityCommand,
          parkingLotId: undefined,
        })
        .expect(400);
    });
    it('Returns 400 if parkingLot does not exist', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${randomId()}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          ...validChangeCapacityCommand,
          parkingLotId: randomId(),
        })
        .expect(400);
    });
    it('Returns 400 if capacity is falsy', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          capacity: undefined,
          parkingLotId,
        })
        .expect(400);
    });
    it('Returns 400 if capacity is negative', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          capacity: -4,
          parkingLotId,
        })
        .expect(400);
    });
    it('Returns 401 if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .send(validChangeCapacityCommand)
        .expect(401);
    });
    it('Returns 403 if user is not admin', async () => {
      await changeUserRole(prismaService, adminUser.id, Role.CLERK);
      const { email, password } = adminUser;
      const { csrfTokenCookie, csrfToken, loginCookies } =
        await authenticateUser(email, password, app);
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send(validChangeCapacityCommand)
        .expect(403);
    });
    it('Returns 403 if CSRF token is missing', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .send(validChangeCapacityCommand)
        .expect(403);
    });
    it('Returns 403 if CSRF token is invalid', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader('bla bla bla'))
        .send(validChangeCapacityCommand)
        .expect(403);
    });
    it('Returns 400 if new capacity is the same as old one', async () => {
      const { capacity: oldCapacity } =
        await prismaService.parkingLot.findFirst({
          where: {
            id: parkingLotId,
          },
        });
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          ...validChangeCapacityCommand,
          capacity: oldCapacity,
        })
        .expect(400);
    });
    it('Changes capacity and returns 204', async () => {
      await request(app.getHttpServer())
        .patch(`${baseUrl}/${parkingLotId}/${changeCapacityURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send(validChangeCapacityCommand)
        .expect(204);
      const { capacity: actualCapacity } =
        await prismaService.parkingLot.findFirst({
          where: {
            id: parkingLotId,
          },
        });
      expect(validChangeCapacityCommand.capacity).toEqual(actualCapacity);
    });
  });
});
