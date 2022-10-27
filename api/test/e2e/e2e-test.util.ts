import { HttpAdapterHost } from '@nestjs/core';
import { GlobalExceptionFilter } from '../../src/infrastructure/web/exception/exception.filter';
import * as cookieParser from 'cookie-parser';
import { TestingModule } from '@nestjs/testing';
import { TokenService } from '../../src/infrastructure/security/token.service';
import { createUser } from '../misc.util';
import { Role } from '../../src/infrastructure/security/authorization/role';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../../src/persistence/prisma/prisma.service';
import * as request from 'supertest';

export const setUpNestApp = async (moduleRef: TestingModule) => {
  const app = moduleRef.createNestApplication();
  app.use(cookieParser());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  return app;
};
export const authCookie = (
  loginCookies: string[],
  csrfTokenCookie: string[] = [],
): ['Cookie', string[]] => {
  return ['Cookie', [...loginCookies, ...csrfTokenCookie]];
};
export const csrfTokenHeader = (token: string): [string, string] => [
  TokenService.CSRF_TOKEN_HEADER_NAME,
  token,
];
export const createAdminUser = async (
  app: INestApplication,
  prismaService: PrismaService,
) => {
  return await createUser(
    app,
    prismaService,
    'mfratczak88@gmail.com',
    Role.ADMIN,
  );
};
export const authenticateAdmin = async (
  email: string,
  password: string,
  app: INestApplication,
) => {
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
    csrfTokenCookie: csrfTokenResponse.headers['set-cookie'] as string[],
    loginCookies: loginResponse.headers['set-cookie'] as string[],
    csrfToken: csrfTokenResponse.body.csrfToken,
  };
};
