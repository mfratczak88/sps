import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '../../../src/persistence/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationToken } from '../../../src/infrastructure/security/user/user';
import { PrismaRegistrationTokenStore } from '../../../src/persistence/prisma/user/prisma.registration-token.store';
import clearAllMocks = jest.clearAllMocks;

describe('Prisma user store', () => {
  let prismaRegistrationTokenStore: PrismaRegistrationTokenStore;
  const findFirst = jest.fn();
  const upsert = jest.fn();
  const prismaServiceMock = createMock<PrismaService>({
    registrationToken: {
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
        PrismaRegistrationTokenStore,
      ],
    }).compile();

    prismaRegistrationTokenStore = module.get<PrismaRegistrationTokenStore>(
      PrismaRegistrationTokenStore,
    );
  });
  afterAll(() => {
    clearAllMocks();
  });

  it('Find by id pass over the id for prisma service', async () => {
    const id = '3333123';
    await prismaRegistrationTokenStore.findById(id);

    expect(findFirst.mock.lastCall).toEqual([
      {
        where: {
          id,
        },
      },
    ]);
  });
  it('Save upsert the user with update of all but id', async () => {
    const registrationToken: RegistrationToken = {
      id: '33',
      userId: '3',
      activationGuid: '44423',
      guidValidTo: '2001-03-03:12:00:00',
    };
    await prismaRegistrationTokenStore.save(registrationToken);
    const { id, ...token } = registrationToken;
    expect(upsert.mock.lastCall).toEqual([
      {
        where: {
          id,
        },
        update: {
          ...token,
        },
        create: {
          ...registrationToken,
        },
      },
    ]);
  });
});
