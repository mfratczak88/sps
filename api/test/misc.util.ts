import { v4 as uuid } from 'uuid';
import {
  RegisterUserCommand,
  RegisterUserResult,
} from '../src/infrastructure/security/authentication.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/persistence/prisma/prisma.service';

export const randomId = () => uuid();
export const createUser = async (
  nestApp: INestApplication,
  prismaService: PrismaService,
) => {
  const user = {
    email: 'mfratczak88@gmail.com',
    password: 'foo3Fczx!!',
    name: 'Maciek',
  };
  const registerResponse = await request(nestApp.getHttpServer())
    .post('/auth/register')
    .send(user);
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
  return { user, activationGuid };
};
