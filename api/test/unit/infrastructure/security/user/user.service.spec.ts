import { createMock } from '@golevelup/ts-jest';
import {
  RegistrationTokenStore,
  UserStore,
} from '../../../../../src/infrastructure/security/user/user.store';
import {
  RegistrationMethod,
  User,
} from '../../../../../src/infrastructure/security/user/user';
import { IdGenerator } from '../../../../../src/domain/id';

import { UserService } from '../../../../../src/infrastructure/security/user/user.service';
import { CreateUserCommand } from '../../../../../src/infrastructure/security/user/user.command';
import { randomId } from '../../../../misc.util';
import { SecurityException } from '../../../../../src/infrastructure/security/security.exception';
import { MessageCode } from '../../../../../src/message';
import { Environment } from '../../../../../src/configuration.module';
import { Role } from '../../../../../src/infrastructure/security/authorization/role';
import clearAllMocks = jest.clearAllMocks;

describe('User service', () => {
  const userStoreMock = createMock<UserStore>();
  const registrationTokenStore = createMock<RegistrationTokenStore>();
  const idGeneratorMock = createMock<IdGenerator>();

  const envMock: Partial<Environment> = {
    ACTIVATE_ACCOUNT_LINK_EXPIRATION_IN_HOURS: 48,
  };
  const userService = new UserService(
    userStoreMock,
    registrationTokenStore,
    idGeneratorMock,
    envMock as Environment,
  );
  beforeEach(() => {
    clearAllMocks();
  });

  it('Delegates find by id to the store', async () => {
    const userId = randomId();
    await userService.findById(userId);

    expect(userStoreMock.findById).toHaveBeenCalledWith(userId);
    expect(userStoreMock.findById).toHaveBeenCalledTimes(1);
  });
  it('Delegates find by email to the store', async () => {
    const userEmail = 'ianbradley@gmail.com';
    await userService.findByEmail(userEmail);

    expect(userStoreMock.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(userStoreMock.findByEmail).toHaveBeenCalledTimes(1);
  });
  it('Creates new user without generating registration token if the user is from social media auth', async () => {
    // given
    const googleUserCreation: CreateUserCommand = {
      email: 'foo@gmail.com',
      name: 'Alex',
      registrationMethod: RegistrationMethod.google,
    };

    const id = randomId();
    idGeneratorMock.generate.mockResolvedValue(id);

    // when
    const resultGoogle = await userService.createNew(googleUserCreation);

    // then
    expect(resultGoogle.user.active).toEqual(true);
    expect(resultGoogle.user.email).toEqual(googleUserCreation.email);
    expect(resultGoogle.user.name).toEqual(googleUserCreation.name);
    expect(registrationTokenStore.save).toHaveBeenCalledTimes(0);
  });
  it('Creates new user which is not active when user registers manually', async () => {
    // given
    const createUserCommand: CreateUserCommand = {
      email: 'foo@gmail.com',
      name: 'Alex',
      registrationMethod: RegistrationMethod.manual,
    };
    const userId = randomId();
    const tokenId = randomId();
    const activationGuid = randomId();
    idGeneratorMock.generate
      .mockResolvedValueOnce(userId)
      .mockResolvedValueOnce(tokenId)
      .mockResolvedValueOnce(activationGuid);
    // when
    const result = await userService.createNew(createUserCommand);

    // then
    expect(result.user.active).toEqual(false);
    expect(result.user.registrationMethod).toEqual(RegistrationMethod.manual);
    expect(result.user.email).toEqual(createUserCommand.email);
    expect(result.user.id).toEqual(userId);
    expect(result.user.name).toEqual(createUserCommand.name);
    expect(result.registrationToken.activationGuid).toEqual(activationGuid);
    expect(result.registrationToken.id).toEqual(tokenId);
    expect(registrationTokenStore.save).toHaveBeenCalledTimes(1);
  });
  it('Returns false when user not exists on isActive call', async () => {
    userStoreMock.findByEmail.mockImplementation(
      async (email) =>
        email === 'foo@gmail.com' &&
        ({
          active: false,
        } as User),
    );
    expect(await userService.isActive('foo@gmail.com')).toEqual(false);
    userStoreMock.findByEmail.mockResolvedValueOnce({
      active: false,
    } as User);
    expect(await userService.isActive('bar@gmail.com')).toEqual(false);
  });
  it('Returns true if use is active on isActive', async () => {
    const userEmail = 'bar@gmail.com';
    userStoreMock.findByEmail.mockImplementation(
      async (email) =>
        email === userEmail &&
        ({
          active: true,
        } as User),
    );
    expect(await userService.isActive('bar@gmail.com')).toEqual(true);
  });
  it('markUserAsActive - throws exception when current date is after the deadline registration date', async () => {
    const activationGuid = randomId();
    const dateInThePast = new Date();
    dateInThePast.setHours(dateInThePast.getHours() - 24);
    registrationTokenStore.findByActivationGuid.mockImplementation(
      async (guid) => {
        if (guid === activationGuid)
          return {
            id: randomId(),
            userId: '4',
            activationGuid,
            guidValidTo: dateInThePast.toISOString(),
          };
      },
    );

    try {
      await userService.markUserAsActive(activationGuid);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(SecurityException);
      expect((err as SecurityException).messageProps.messageKey).toEqual(
        MessageCode.URL_NO_LONGER_VALID,
      );
    }
  });
  it('markUserAsActive - throws exception when activation guid is invalid', async () => {
    const activationGuid = randomId();
    const dateInThePast = new Date();
    dateInThePast.setHours(dateInThePast.getHours() - 24);
    registrationTokenStore.findByActivationGuid.mockResolvedValue(undefined);

    try {
      await userService.markUserAsActive(activationGuid);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(SecurityException);
      expect((err as SecurityException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_ACTIVATION_GUID,
      );
    }
  });
  it('markUserAsActive - sets active flag on user', async () => {
    const activationGuid = randomId();
    const tokenDate = new Date();
    const user: User = {
      id: randomId(),
      name: 'Mike',
      registrationMethod: RegistrationMethod.manual,
      email: 'mike@gmail.com',
      password: 'foo',
      active: false,
      role: Role.ADMIN,
    };
    tokenDate.setHours(tokenDate.getHours() + 48);
    registrationTokenStore.findByActivationGuid.mockImplementation(
      async (guid) => {
        if (guid === activationGuid)
          return {
            id: randomId(),
            guidValidTo: tokenDate.toISOString(),
            activationGuid,
            userId: user.id,
          };
      },
    );
    userStoreMock.findById.mockImplementation(async (id) => {
      if (id === user.id) return user;
    });
  });
  it('Changes password', async () => {
    const id = '123';
    const user: User = {
      id: id,
      name: 'Kamil',
      password: 'Ślimak',
      active: true,
      email: 'legia@legia.pl',
      registrationMethod: RegistrationMethod.manual,
      role: Role.DRIVER,
    };
    userStoreMock.findById.mockImplementation(
      async (userId) => id === userId && user,
    );
    const newPassword = 'newpassword';
    const userWithChangedPass = await userService.changePassword(
      id,
      newPassword,
    );
    expect(userWithChangedPass.password).toEqual(newPassword);
  });
  it('Throws exception when old password incorrect during password change', async () => {
    userStoreMock.findById.mockImplementation(async () => undefined);
    try {
      await userService.changePassword('123', 'newpassword');
    } catch (err) {
      expect(err).toBeInstanceOf(SecurityException);
      expect((err as SecurityException).messageProps.messageKey).toEqual(
        MessageCode.USER_DOES_NOT_EXIST,
      );
    }
  });

  it('Fetches all users and transforms them to dtos', async () => {
    userStoreMock.findAll.mockResolvedValue([
      {
        id: '1',
        role: Role.ADMIN,
        email: 'foo@gmail.com',
        name: 'Adam',
        password: 'foo33',
        active: true,
        registrationMethod: RegistrationMethod.manual,
      },
      {
        id: '2',
        role: Role.DRIVER,
        email: 'bar@gmail.com',
        name: 'Carol',
        password: 'carol123',
        active: true,
        registrationMethod: RegistrationMethod.manual,
      },
    ]);
    const [first, second] = await userService.getAll();

    // discard those
    expect(first['password']).toBeFalsy();
    expect(second['password']).toBeFalsy();
    expect(first['active']).toBeFalsy();
    expect(second['active']).toBeFalsy();
    expect(first['registrationMethod']).toBeFalsy();
    expect(second['registrationMethod']).toBeFalsy();

    expect(first.id).toEqual('1');
    expect(first.name).toEqual('Adam');
    expect(first.email).toEqual('foo@gmail.com');
    expect(first.role).toEqual(Role.ADMIN);

    expect(second.id).toEqual('2');
    expect(second.name).toEqual('Carol');
    expect(second.email).toEqual('bar@gmail.com');
    expect(second.role).toEqual(Role.DRIVER);
  });

  it('saves the new role of the user', async () => {
    const existingUser: User = {
      id: '2',
      role: Role.DRIVER,
      email: 'bar@gmail.com',
      name: 'Carol',
      password: 'carol123',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };
    userStoreMock.findById.mockImplementation(async (id) => {
      if (id === '2') return existingUser;
    });
    await userService.changeRole('2', Role.ADMIN);
    expect(userStoreMock.save).toHaveBeenCalledWith({
      ...existingUser,
      role: Role.ADMIN,
    });
  });
  it('Throws exception when user does not exist on role change', async () => {
    userStoreMock.findById.mockResolvedValue(null);
    try {
      await userService.changeRole('3sadsa', Role.DRIVER);
    } catch (err) {
      expect(err).toBeInstanceOf(SecurityException);
      expect((err as SecurityException).messageProps.messageKey).toEqual(
        MessageCode.USER_DOES_NOT_EXIST,
      );
    }
  });
});
