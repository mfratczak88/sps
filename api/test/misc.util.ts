import { v4 as uuid } from 'uuid';
import { RegisterUserResult } from '../src/infrastructure/security/authentication/authentication.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/persistence/prisma/prisma.service';
import {
  RegistrationMethod,
  User,
} from '../src/infrastructure/security/user/user';
import { Role } from '../src/infrastructure/security/authorization/role';
import { DateTime } from 'luxon';

export const randomId = (): string => uuid();
export const randomUser = (role: Role): User => {
  const id = randomId().replace('-', '');
  return {
    id: id,
    email: id + '@gmail.com',
    password: id,
    role,
    name: id,
    registrationMethod: RegistrationMethod.manual,
    active: true,
  };
};
export const USER_PASS = 'foo3Fczx!!';
export const createUser = async (
  nestApp: INestApplication,
  prismaService: PrismaService,
  email?: string,
  role?: Role,
) => {
  const user = {
    email: email || 'mfratczak88@gmail.com',
    password: USER_PASS,
    name: 'Maciek',
  };
  const registerResponse = await request(nestApp.getHttpServer())
    .post('/auth/register')
    .send(user);
  const newlyCreatedUserId = (registerResponse.body as RegisterUserResult).id;
  await prismaService.registrationToken.findFirst({
    where: {
      userId: newlyCreatedUserId,
    },
  });
  const u = await prismaService.user.update({
    where: {
      id: newlyCreatedUserId,
    },
    data: {
      role: role || Role.DRIVER,
      active: true,
    },
  });
  return {
    ...u,
    password: user.password,
  } as User;
};
export const randomElementFromArray = <T>(array: T[]) => {
  const index = Math.floor(Math.random() * 10) % array.length;
  return array[index];
};

export const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), milliseconds));

export const approxTheSameTime = (dateA: Date, dateB: Date) => {
  return (
    DateTime.fromJSDate(dateA)
      .diff(DateTime.fromJSDate(dateB))
      .as('milliseconds') < 1000
  );
};
