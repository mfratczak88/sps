import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '../../../src/persistence/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserStore } from '../../../src/persistence/prisma/prisma.user.store';
import {
  RegistrationMethod,
  User,
} from '../../../src/infrastructure/security/user';
import clearAllMocks = jest.clearAllMocks;

describe('Prisma user store', () => {
  let prismaUserStore: PrismaUserStore;
  const findFirst = jest.fn();
  const upsert = jest.fn();
  const prismaServiceMock = createMock<PrismaService>({
    user: {
      upsert,
      findFirst,
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        PrismaUserStore,
      ],
    }).compile();

    prismaUserStore = module.get<PrismaUserStore>(PrismaUserStore);
  });
  afterAll(() => {
    clearAllMocks();
  });
  it('Find by email pass over the id for prisma service', async () => {
    const email = 'jackie@example.com';
    await prismaUserStore.findByEmail(email);

    expect(findFirst.mock.lastCall).toEqual([
      {
        where: {
          email,
        },
      },
    ]);
  });
  it('Find by id pass over the id for prisma service', async () => {
    const id = '3333123';
    await prismaUserStore.findById(id);

    expect(findFirst.mock.lastCall).toEqual([
      {
        where: {
          id,
        },
      },
    ]);
  });
  it('Save upsert the user with update of all but id', async () => {
    const user: User = {
      id: '3',
      email: 'some@gmail.com',
      name: 'Mike',
      active: false,
      password: 'foo',
      registrationMethod: RegistrationMethod.manual,
    };
    await prismaUserStore.save(user);
    const { id, ...userData } = user;
    expect(upsert.mock.lastCall).toEqual([
      {
        where: {
          id,
        },
        update: {
          ...userData,
        },
        create: {
          ...user,
        },
      },
    ]);
  });
});
