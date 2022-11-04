import { changeUserRole, clear, insertUser } from '../db.util';
import { randomElementFromArray, randomUser } from '../misc.util';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/persistence/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { Role } from '../../src/infrastructure/security/authorization/role';
import { User } from '../../src/infrastructure/security/user/user';
import {
  authCookie,
  authenticateUser,
  createAdminUser,
  csrfTokenHeader,
  setUpNestApp,
} from './e2e-test.util';

describe('users e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  const users: User[] = [];
  let adminUser: User;
  const baseUrl = '/users';

  const insertUsers = async () => {
    users.push(
      ...(await Promise.all([
        insertUser(prismaService, randomUser(Role.DRIVER)),
        insertUser(prismaService, randomUser(Role.DRIVER)),
        insertUser(prismaService, randomUser(Role.DRIVER)),
        insertUser(prismaService, randomUser(Role.CLERK)),
      ])),
    );
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await setUpNestApp(moduleRef);
    prismaService = moduleRef.get(PrismaService);
    await clear(prismaService);
    await insertUsers();
    adminUser = await createAdminUser(app, prismaService);
  });
  beforeEach(async () => {
    await changeUserRole(prismaService, adminUser.id, Role.ADMIN);
  });
  afterAll(async () => {
    await app.close();
  });
  it('Change role - returns 401 if user is not logged in', async () => {
    const { id } = users[1];
    request(app.getHttpServer())
      .patch(`${baseUrl}/${id}`)
      .send({
        role: Role.ADMIN,
      })
      .expect(401);
  });
  it('Change role - returns 401 if user does not provide valid CSRF Token', async () => {
    const { email, password } = adminUser;
    const { loginCookies } = await authenticateUser(email, password, app);
    const { id } = randomElementFromArray<User>(users);
    request(app.getHttpServer())
      .patch(`${baseUrl}/${id}`)
      .set(...authCookie(loginCookies))
      .send({
        role: Role.ADMIN,
      })
      .expect(401);
  });
  it('Change role - returns 403 if user is not admin', async () => {
    const { id: adminId, email, password } = adminUser;
    await changeUserRole(prismaService, adminId, Role.CLERK);
    const { loginCookies, csrfToken, csrfTokenCookie } = await authenticateUser(
      email,
      password,
      app,
    );
    const { id: userId } = randomElementFromArray<User>(users);

    request(app.getHttpServer())
      .patch(`${baseUrl}/${userId}`)
      .set(...authCookie(loginCookies, csrfTokenCookie))
      .set(...csrfTokenHeader(csrfToken))
      .send({
        role: Role.ADMIN,
      })
      .expect(403);
  });
  it('Get users - returns 401 if user is not logged in', async () => {
    request(app.getHttpServer()).get(`${baseUrl}`).expect(401);
  });
  it('Get users - returns 403 if user is not admin', async () => {
    const { id: adminId, email, password } = adminUser;
    await changeUserRole(prismaService, adminId, Role.CLERK);
    const { loginCookies, csrfToken, csrfTokenCookie } = await authenticateUser(
      email,
      password,
      app,
    );
    request(app.getHttpServer())
      .get(`${baseUrl}`)
      .set(...authCookie(loginCookies, csrfTokenCookie))
      .set(...csrfTokenHeader(csrfToken))
      .expect(403);
  });
  it('Change role - returns 400 if role is invalid', async () => {
    const { email, password } = adminUser;
    const { loginCookies, csrfToken, csrfTokenCookie } = await authenticateUser(
      email,
      password,
      app,
    );
    request(app.getHttpServer())
      .patch(`${baseUrl}/${randomElementFromArray(users).id}`)
      .set(...authCookie(loginCookies, csrfTokenCookie))
      .set(...csrfTokenHeader(csrfToken))
      .send({
        role: 'FOOOOOOO',
      })
      .expect(400);
  });
  it('Change role - returns 400 if role is missing', async () => {
    const { email, password } = adminUser;
    const { loginCookies, csrfToken, csrfTokenCookie } = await authenticateUser(
      email,
      password,
      app,
    );
    request(app.getHttpServer())
      .patch(`${baseUrl}/${randomElementFromArray(users).id}`)
      .set(...authCookie(loginCookies, csrfTokenCookie))
      .set(...csrfTokenHeader(csrfToken))
      .send({})
      .expect(400);
  });
  it('Changes user role and returns 200', async () => {
    const { email, password } = adminUser;
    const { loginCookies, csrfToken, csrfTokenCookie } = await authenticateUser(
      email,
      password,
      app,
    );
    const { id: userId } = randomElementFromArray(users);
    await request(app.getHttpServer())
      .patch(`${baseUrl}/${userId}`)
      .set(...authCookie(loginCookies, csrfTokenCookie))
      .set(...csrfTokenHeader(csrfToken))
      .send({
        role: Role.ADMIN,
      })
      .expect(200);

    const { role } = await prismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    expect(role).toEqual(Role.ADMIN);
  });
});
