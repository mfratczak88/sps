import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/persistence/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { clear } from '../db.util';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import {
  LoginCommand,
  RegisterUserCommand,
  RegisterUserResult,
  UserDto,
} from '../../src/infrastructure/security/authentication.service';
import { GlobalExceptionFilter } from '../../src/infrastructure/web/exception/exception.filter';
import { ExceptionCode } from '../../src/error';
import { MessageCode } from '../../src/message';

describe('Auth e2e', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
    prismaService = moduleRef.get(PrismaService);
  });
  beforeEach(async () => {
    await clear(prismaService);
  });
  afterAll(async () => {
    await clear(prismaService);
    await prismaService.$disconnect();
    await app.close();
  });
  const extractCookiesFromResponse = (response: request.Response) => {
    const cookiesStr: string[] = response.headers['set-cookie'];
    return cookiesStr.map((x) => {
      const [cookieKey, cookieValue] = x.split(';')[0].split('=');
      return {
        cookieKey,
        cookieValue,
      };
    });
  };
  const createUser = async (
    registerUserCommand: RegisterUserCommand,
    nestApp: INestApplication = app,
  ) => {
    const registerResponse = await request(nestApp.getHttpServer())
      .post('/auth/register')
      .send(registerUserCommand);
    const newlyCreatedUserId = (registerResponse.body as RegisterUserResult).id;
    const activationGuid = (
      await prismaService.registrationToken.findFirst({
        where: {
          userId: newlyCreatedUserId,
        },
      })
    ).activationGuid;
    await request(nestApp.getHttpServer())
      .post('/auth/confirmRegistration')
      .send({
        activationGuid,
      });
    return { userId: newlyCreatedUserId, activationGuid };
  };
  it('Register user, confirm registration, and login', async () => {
    const registerCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Maciej',
      password: 'foo4332c3#1fsXX!',
    };

    // 1. Register
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerCommand);
    const newlyCreatedUserId = (registerResponse.body as RegisterUserResult).id;
    // it comes by link
    const activationGuid = (
      await prismaService.registrationToken.findFirst({
        where: {
          userId: newlyCreatedUserId,
        },
      })
    ).activationGuid;

    // 2. Confirm account creation
    await request(app.getHttpServer()).post('/auth/confirmRegistration').send({
      activationGuid,
    });

    const loginCommand: LoginCommand = {
      email: 'mfratczak88@gmail.com',
      password: registerCommand.password,
    };

    // 3. Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginCommand);
    const loginResponseBody: UserDto = loginResponse.body;
    expect(loginResponse.status).toEqual(200);
    expect(loginResponseBody.id).toEqual(newlyCreatedUserId);
    expect(loginResponseBody.email).toEqual(registerCommand.email);
    console.log(loginResponse);
  });
  it('Create account, confirm, login & refresh token', async () => {
    const registerCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Alex',
      password: 'dsad3e3#1fsXX!',
    };
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerCommand);
    const newlyCreatedUserId = (registerResponse.body as RegisterUserResult).id;
    const activationGuid = (
      await prismaService.registrationToken.findFirst({
        where: {
          userId: newlyCreatedUserId,
        },
      })
    ).activationGuid;

    await request(app.getHttpServer()).post('/auth/confirmRegistration').send({
      activationGuid,
    });

    const loginCommand: LoginCommand = {
      email: 'mfratczak88@gmail.com',
      password: registerCommand.password,
    };
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginCommand);

    const cookies = loginResponse.headers['set-cookie'];

    const refreshResponse = await request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Cookie', cookies);

    expect(refreshResponse.status).toEqual(200);
  });
  it('Login & logout', async () => {
    const userRegisterCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Jonah',
      password: 'fuckThaPolice1488',
    };
    const { userId } = await createUser(userRegisterCommand);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userRegisterCommand.email,
        password: userRegisterCommand.password,
      });
    const loginResponseCookies = loginResponse.headers['set-cookie'];
    expect(loginResponse.status).toEqual(200);
    expect(loginResponse.body.id).toEqual(userId);

    const logoutResponse = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', loginResponseCookies);
    const logoutResponseCookies = extractCookiesFromResponse(logoutResponse);
    const allCookiesAreEmpty = logoutResponseCookies
      .map((x) => x.cookieValue)
      .every((value) => !value);
    expect(logoutResponse.status).toEqual(200);
    expect(allCookiesAreEmpty).toEqual(true);
  });
  it('Generates CSRF token', async () => {
    const user: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'John',
      password: '44dsadd3##32!!',
    };
    await createUser(user);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      });
    const loginResponseCookies = loginResponse.headers['set-cookie'];
    const csrfTokenResponse = await request(app.getHttpServer())
      .get('/auth/csrfToken')
      .set('Cookie', loginResponseCookies);

    expect(csrfTokenResponse.status).toEqual(200);
    expect(csrfTokenResponse.body.csrfToken).toBeTruthy();
  });
  it('Register - returns 403 when user is already registered and trying to register', async () => {
    const registerUserCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Maciej',
      password: 'xXXXw231ds@##',
    };
    await createUser(registerUserCommand);
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerUserCommand);

    expect(response.status).toEqual(403);
    expect(response.body.statusCode).toEqual(ExceptionCode.FORBIDDEN);
    expect(response.body.messageCode).toEqual(MessageCode.USER_ALREADY_EXIST);
  });
  it('Login - returns 400 when user does not exist and tries to log in', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'foo@gmail.com',
        password: 'somerandomPAss332#',
      });

    expect(response.status).toEqual(401);
    expect(response.body.statusCode).toEqual(ExceptionCode.UNAUTHORIZED);
    expect(response.body.messageCode).toEqual(
      MessageCode.INVALID_USERNAME_OR_PASSWORD,
    );
  });
  it('Refresh token - returns 401 when refresh token cannot be issued', async () => {
    const refreshWithoutCredentialsResponse = await request(
      app.getHttpServer(),
    ).get('/auth/refresh');

    expect(refreshWithoutCredentialsResponse.status).toEqual(401);
  });
  it('Register - returns 400 when user provides incomplete or invalid data for register', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'xxxx',
        password: '',
        name: '',
      })
      .expect(400);
  });
  it('Login - returns 400 when user provides incomplete or invalid data for login', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'xxxx',
        password: '',
      })
      .expect(400);
  });
  it('CSRF Token - returns 401 when unauthenticated users tries to generate CSRF token', async () => {
    await request(app.getHttpServer()).get('/auth/csrfToken').expect(401);
  });
  it('Account confirmation - returns 400 when user tries to confirm registration with invalid link', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/confirmRegistration')
      .send({
        activationGuid: 'foo',
      });
    expect(response.status).toBe(400);
    expect(response.body.statusCode).toBe(ExceptionCode.BAD_REQUEST);
    expect(response.body.messageCode).toBe(MessageCode.INVALID_ACTIVATION_GUID);
  });
  it('Account confirmation - returns 400 when user tries to confirm registration with expired link', async () => {
    const registerUserCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Mike',
      password: 'someRandomPas3#',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerUserCommand);
    const responseBody: RegisterUserResult = response.body;
    const registrationToken = await prismaService.registrationToken.findFirst({
      where: {
        userId: responseBody.id,
      },
    });
    const dateInThePast = new Date();
    dateInThePast.setHours(dateInThePast.getHours() - 10);
    registrationToken.guidValidTo = dateInThePast.toISOString();
    await prismaService.registrationToken.update({
      where: {
        id: registrationToken.id,
      },
      data: {
        ...registrationToken,
      },
    });

    const confirmRegistrationResponse = await request(app.getHttpServer())
      .post('/auth/confirmRegistration')
      .send({
        activationGuid: registrationToken.activationGuid,
      });

    expect(confirmRegistrationResponse.status).toEqual(400);
    expect(confirmRegistrationResponse.body.messageCode).toEqual(
      MessageCode.URL_NO_LONGER_VALID,
    );
    expect(confirmRegistrationResponse.body.statusCode).toEqual(
      ExceptionCode.BAD_REQUEST,
    );
  });
  it('Resend confirmation link - resends the link if expired', async () => {
    const registerUserCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Mike',
      password: 'someRandomPas3#3#',
    };
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerUserCommand);
    const responseBody: RegisterUserResult = response.body;
    const registrationToken = await prismaService.registrationToken.findFirst({
      where: {
        userId: responseBody.id,
      },
    });
    const dateInThePast = new Date();
    dateInThePast.setHours(dateInThePast.getHours() - 10);
    registrationToken.guidValidTo = dateInThePast.toISOString();
    await prismaService.registrationToken.update({
      where: {
        id: registrationToken.id,
      },
      data: {
        ...registrationToken,
      },
    });

    const registrationResponse = await request(app.getHttpServer())
      .post('/auth/resendRegistrationConfirmation')
      .send({
        activationGuid: registrationToken.activationGuid,
      });

    expect(registrationResponse.status).toEqual(201);
  });
  it('Resend confirmation link - returns 400 if old activation guid is invalid', async () => {
    await request(app.getHttpServer())
      .post('/auth/resendRegistrationConfirmation')
      .send({
        activationGuid: '',
      });
  });
  it('Resend confirmation link - returns 400 if user is already active', async () => {
    const { activationGuid } = await createUser({
      email: 'mfratczak88@gmail.com',
      name: 'Maciej',
      password: 'fooBardx33123@',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/resendRegistrationConfirmation')
      .send({
        activationGuid,
      });

    expect(response.status).toBe(400);
    expect(response.body.messageCode).toBe(MessageCode.USER_IS_ALREADY_ACTIVE);
    expect(response.body.statusCode).toBe(ExceptionCode.BAD_REQUEST);
  });

  it('Change password', async () => {
    const registerCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Maciej',
      password: 'fooBardx33123@',
    };
    const { userId } = await createUser(registerCommand);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: registerCommand.email,
        password: registerCommand.password,
      });
    const loginResponseCookies = loginResponse.headers['set-cookie'];
    expect(loginResponse.status).toEqual(200);
    expect(loginResponse.body.id).toEqual(userId);

    const changePasswordResponse = await request(app.getHttpServer())
      .post('/auth/changePassword')
      .set('Cookie', loginResponseCookies)
      .send({ oldPassword: 'fooBardx33123@', newPassword: 'newpassword' });
    expect(changePasswordResponse.status).toEqual(200);
  });

  it('Change password - return 401', async () => {
    const registerCommand: RegisterUserCommand = {
      email: 'mfratczak88@gmail.com',
      name: 'Maciej',
      password: 'fooBardx33123@',
    };
    const { userId } = await createUser(registerCommand);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: registerCommand.email,
        password: registerCommand.password,
      });
    const loginResponseCookies = loginResponse.headers['set-cookie'];
    expect(loginResponse.status).toEqual(200);
    expect(loginResponse.body.id).toEqual(userId);

    const changePasswordResponse = await request(app.getHttpServer())
      .post('/auth/changePassword')
      .set('Cookie', loginResponseCookies)
      .send({ oldPassword: 'badpassword', newPassword: 'newpassword' });
    expect(changePasswordResponse.status).toEqual(401);
  });
});
