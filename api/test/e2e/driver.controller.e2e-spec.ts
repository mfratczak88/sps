import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/persistence/prisma/prisma.service';
import { User } from '../../src/infrastructure/security/user/user';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {
  authCookie,
  authenticateUser,
  createAdminUser,
  createDriverUser,
  createDummyParkingLot,
  csrfTokenHeader,
  setUpNestApp,
} from './e2e-test.util';
import { changeUserRole, clear } from '../db.util';
import { Role } from '../../src/infrastructure/security/authorization/role';
import { randomId } from '../misc.util';
import * as request from 'supertest';

describe('Driver e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let adminUser: User;
  let csrfTokenCookie: string[];
  let loginCookies: string[];
  let csrfToken: string;
  const baseUrl = '/drivers';
  const parkingLotsURI = 'parkingLots';
  let driver: User;
  let driverId: string;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await setUpNestApp(moduleRef);
    prismaService = moduleRef.get(PrismaService);
    await clear(prismaService);
    adminUser = await createAdminUser(app, prismaService);
    driver = await createDriverUser(app, prismaService);
    ({ id: driverId } = driver);
  });
  beforeEach(async () => {
    const { email, password } = adminUser;
    ({ csrfTokenCookie, csrfToken, loginCookies } = await authenticateUser(
      email,
      password,
      app,
    ));
    await changeUserRole(prismaService, adminUser.id, Role.ADMIN);
  });
  afterAll(async () => {
    await app.close();
  });
  describe('Add vehicle', () => {
    const parkingLotId = randomId();
    const vehiclesURI = 'vehicles';
    beforeAll(async () => {
      await createDummyParkingLot(parkingLotId, prismaService);
    });
    beforeEach(async () => {
      await prismaService.vehicle.deleteMany({
        where: {
          userId: driver.id,
        },
      });
    });

    it('Returns 400 if license plate is falsy', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${vehiclesURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
        })
        .expect(400);
    });
    it('Returns 400 if vehicle is already assigned', async () => {
      const licensePlate = 'CT043SFX';
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${vehiclesURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          licensePlate,
        })
        .expect(201);
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${vehiclesURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          licensePlate,
        })
        .expect(400);
    });
    it('Returns 400 if driver does not exist', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${randomId()}/${vehiclesURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId: randomId(),
          licensePlate: 'CTXX3ZV',
        })
        .expect(400);
    });
    it('Returns 401 if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${vehiclesURI}`)
        .send({
          driverId,
          licensePlate: 'CTXX3ZV',
        })
        .expect(401);
    });
    it('Returns 403 if CSRF token is missing or invalid', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${vehiclesURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .send({
          driverId,
          licensePlate: 'CTXX3ZV',
        })
        .expect(403);

      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${vehiclesURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader('invalidtoken'))
        .send({
          driverId,
          licensePlate: 'CTXX3ZV',
        })
        .expect(403);
    });
    it('Adds vehicle to driver vehicles and returns 201', async () => {
      const licensePlate = 'CT043SFX';
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${vehiclesURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          licensePlate,
        })
        .expect(201);

      const vehicle = await prismaService.vehicle.findFirst({
        where: {
          userId: driverId,
          licensePlate,
        },
      });
      expect(vehicle).toBeDefined();
    });
  });
  describe('Parking lot assignment', () => {
    const parkingLotId = randomId();
    beforeAll(async () => {
      await createDummyParkingLot(parkingLotId, prismaService);
    });
    beforeEach(async () => {
      await prismaService.user.update({
        where: {
          id: driver.id,
        },
        data: {
          parkingLots: {
            set: [],
          },
        },
      });
    });
    it('Returns 400 if parking lot does not exist', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          parkingLot: randomId(),
        })
        .expect(400);
    });
    it('Returns 400 if lot is already assigned', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          parkingLotId,
        })
        .expect(201);
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          parkingLotId,
        })
        .expect(400);
    });
    it('Returns 400 if driver does not exist', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${randomId()}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId: randomId(),
          parkingLotId,
        })
        .expect(400);
    });
    it('Returns 401 if user is not authenticated', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .send({
          driverId,
          parkingLotId,
        })
        .expect(401);
    });
    it('Returns 403 if CSRF token is missing or invalid', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .send({
          driverId,
          parkingLotId,
        })
        .expect(403);
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader('dasdsadasdsa'))
        .send({
          driverId,
          parkingLotId,
        })
        .expect(403);
    });
    it('Assigns driver to parking lot', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          parkingLotId,
        })
        .expect(201);

      const { parkingLots } = await prismaService.user.findFirst({
        where: {
          id: driverId,
        },
        select: {
          parkingLots: true,
        },
      });
      const [{ id }] = parkingLots;
      expect(id).toEqual(parkingLotId);
    });
  });
  describe('Parking lot assignment removal', () => {
    const parkingLotId = randomId();
    beforeAll(async () => {
      await createDummyParkingLot(parkingLotId, prismaService);
    });
    beforeEach(async () => {
      await prismaService.user.update({
        where: {
          id: driver.id,
        },
        data: {
          parkingLots: {
            set: [],
          },
        },
      });
    });
    it('Returns 400 if parking lot is not assigned', async () => {
      await request(app.getHttpServer())
        .delete(`${baseUrl}/${driverId}/${parkingLotsURI}/${randomId()}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          parkingLotId: randomId(),
        })
        .expect(400);
    });
    it('Returns 400 if driver does not exist', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${randomId()}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId: randomId(),
          parkingLotId,
        })
        .expect(400);
    });
    it('Removes parking lot assignment and returns 202', async () => {
      await request(app.getHttpServer())
        .post(`${baseUrl}/${driverId}/${parkingLotsURI}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          parkingLotId,
        })
        .expect(201);

      await request(app.getHttpServer())
        .del(`${baseUrl}/${driverId}/${parkingLotsURI}/${parkingLotId}`)
        .set(...authCookie(loginCookies, csrfTokenCookie))
        .set(...csrfTokenHeader(csrfToken))
        .send({
          driverId,
          parkingLotId,
        })
        .expect(202);

      const { parkingLots } = await prismaService.user.findFirst({
        where: {
          id: driverId,
        },
        select: {
          parkingLots: true,
        },
      });

      expect(parkingLots.some((x) => x.id === parkingLotId)).toBe(false);
    });
  });
});
