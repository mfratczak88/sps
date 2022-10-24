import { changeUserRole, clear, insertUser } from '../db.util';
import { createUser, randomElementFromArray, randomUser } from '../misc.util';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/persistence/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { GlobalExceptionFilter } from '../../src/infrastructure/web/exception/exception.filter';
import * as cookieParser from 'cookie-parser';
import { Role } from '../../src/infrastructure/security/authorization/role';
import { User, UserDto } from '../../src/infrastructure/security/user/user';
import { TokenService } from '../../src/infrastructure/security/token.service';

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
  const createAdminUser = async () => {
    adminUser = await createUser(
      app,
      prismaService,
      'mfratczak88@gmail.com',
      Role.ADMIN,
    );
  };
  const authenticateUser = async (email: string, password: string) => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: email,
        password: password,
      });
    const csrfTokenResponse = await request(app.getHttpServer())
      .get('/auth/csrfToken')
      .set('Cookie', loginResponse.headers['set-cookie']);
    return {
      csrfTokenCookie: csrfTokenResponse.headers['set-cookie'],
      loginCookies: loginResponse.headers['set-cookie'],
      csrfToken: csrfTokenResponse.body.csrfToken,
    };
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prismaService = moduleRef.get(PrismaService);
    await clear(prismaService);
    await insertUsers();
    await createAdminUser();
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
    const { loginCookies } = await authenticateUser(email, password);
    const { id } = randomElementFromArray<User>(users);
    request(app.getHttpServer())
      .patch(`${baseUrl}/${id}`)
      .set('Cookie', [...loginCookies])
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
    );
    const { id: userId } = randomElementFromArray<User>(users);

    request(app.getHttpServer())
      .patch(`${baseUrl}/${userId}`)
      .set('Cookie', [...loginCookies, ...csrfTokenCookie])
      .set(TokenService.CSRF_TOKEN_HEADER_NAME, csrfToken)
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
    );
    request(app.getHttpServer())
      .get(`${baseUrl}`)
      .set('Cookie', [...loginCookies, ...csrfTokenCookie])
      .set(TokenService.CSRF_TOKEN_HEADER_NAME, csrfToken)
      .expect(403);
  });
  it('Change role - returns 400 if role is invalid', async () => {
    const { email, password } = adminUser;
    const { loginCookies, csrfToken, csrfTokenCookie } = await authenticateUser(
      email,
      password,
    );
    request(app.getHttpServer())
      .patch(`${baseUrl}/${randomElementFromArray(users).id}`)
      .set('Cookie', [...loginCookies, ...csrfTokenCookie])
      .set(TokenService.CSRF_TOKEN_HEADER_NAME, csrfToken)
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
    );
    request(app.getHttpServer())
      .patch(`${baseUrl}/${randomElementFromArray(users).id}`)
      .set('Cookie', [...loginCookies, ...csrfTokenCookie])
      .set(TokenService.CSRF_TOKEN_HEADER_NAME, csrfToken)
      .send({})
      .expect(400);
  });
  it('Changes user role and returns 200', async () => {
    const { email, password } = adminUser;
    const { loginCookies, csrfToken, csrfTokenCookie } = await authenticateUser(
      email,
      password,
    );
    const { id: userId } = randomElementFromArray(users);
    await request(app.getHttpServer())
      .patch(`${baseUrl}/${userId}`)
      .set('Cookie', [...loginCookies, ...csrfTokenCookie])
      .set(TokenService.CSRF_TOKEN_HEADER_NAME, csrfToken)
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
