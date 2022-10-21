import { UserService } from '../../../../src/infrastructure/security/user.service';
import {
  RegistrationMethod,
  RegistrationToken,
  User,
} from '../../../../src/infrastructure/security/user';
import {
  anything,
  capture,
  deepEqual,
  instance,
  mock,
  reset,
  when,
} from 'ts-mockito';
import { CookieService } from '../../../../src/infrastructure/security/cookie.service';
import { TokenService } from '../../../../src/infrastructure/security/token.service';
import { Response } from 'express';
import {
  AuthenticationService,
  LoginWithGoogleCommand,
  RegisterUserCommand,
} from '../../../../src/infrastructure/security/authentication.service';
import * as bcrypt from 'bcrypt';
import { Environment } from '../../../../src/configuration.module';
import { EmailService } from '../../../../src/infrastructure/email/email.service';

import { SecurityException } from '../../../../src/infrastructure/security/security.exception';
import { LanguageService } from '../../../../src/application/language.service';
import { randomId } from '../../../misc.util';
import { createMock } from '@golevelup/ts-jest';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { MessageCode } from '../../../../src/message';

jest.mock('bcrypt');
describe('Auth service', () => {
  const userServiceMock = mock(UserService);
  const userService = instance(userServiceMock);
  const envMock = mock(Environment);
  const env = instance(envMock);
  const cookieServiceMock = mock(CookieService);
  const cookieService = instance(cookieServiceMock);
  const tokenServiceMock = mock(TokenService);
  const tokenService = instance(tokenServiceMock);
  const emailServiceMock = mock(EmailService);
  const emailService = instance(emailServiceMock);
  const responseMock = mock<Response>();
  const response = instance(responseMock);
  const googleAuthClientMock = createMock<OAuth2Client>();
  const langServiceMock: Partial<LanguageService> = {
    get language(): string {
      return 'PL';
    },
  };
  const authService = new AuthenticationService(
    userService,
    env,
    cookieService,
    tokenService,
    emailService,
    langServiceMock as LanguageService,
    googleAuthClientMock,
  );

  beforeEach(() => {
    reset<unknown>(
      tokenServiceMock,
      responseMock,
      cookieServiceMock,
      envMock,
      userServiceMock,
    );
  });

  it('Clears cookies on login exception', async () => {
    when(tokenServiceMock.signAuthTokenPair(anything(), anything())).thenThrow(
      new Error('Token error'),
    );
    try {
      await authService.login(null, response);
      fail('Exception not thrown');
    } catch (e) {
      const clearAllArg = capture(cookieServiceMock.clearAll).last()[0];
      expect(clearAllArg).toBe(response);
    }
  });

  it('Clears cookies on refresh token error', async () => {
    when(userServiceMock.findById(anything())).thenThrow(
      new Error('Repo error'),
    );
    try {
      await authService.onRefreshToken(response, null);
      fail('Exception not thrown');
    } catch (e) {
      const clearAllArg = capture(cookieServiceMock.clearAll).last()[0];
      expect(clearAllArg).toBe(response);
    }
  });
  it('Clears all cookies on logout', async () => {
    await authService.logout(response);
    expect(capture(cookieServiceMock.clearAll).last()[0]).toBe(response);
  });
  it('Throws unauthorized exception on login with wrong password', async () => {
    const command = {
      email: 'boris.johnson@gmail.com',
      password: 'FuckEU1234',
    };

    bcrypt.compareSync = jest.fn(() => {
      throw Error('Bcrypt error');
    });
    try {
      await authService.login(command, response);
      fail('Exception not thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(SecurityException);
    }
  });
  it('Throws unauthorized exception on login with non existing user', async () => {
    const command = {
      email: 'boris.johnson@gmail.com',
      password: 'FuckEU1234',
    };

    bcrypt.compareSync = jest.fn(() => {
      throw Error('Bcrypt error');
    });
    when(userServiceMock.findByEmail(anything())).thenReturn(undefined);
    try {
      await authService.login(command, response);
      fail('Exception not thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(SecurityException);
    }
  });
  it('Adds auth & refresh tokens to cookies on login', async () => {
    //given
    const command = {
      email: 'boris.johnson@gmail.com',
      password: 'FuckEU1234',
    };
    const user: User = {
      id: randomId(),
      email: command.email,
      password: '34dasdnasjdnj!',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };
    const authToken = '3434';
    const refreshToken = '3434sdax1';
    when(userServiceMock.findByEmail(command.email)).thenResolve(user);
    bcrypt.compareSync = jest.fn(
      (password, passwordHash) =>
        password === command.password && passwordHash === user.password,
    );
    when(tokenServiceMock.signAuthTokenPair(anything(), anything())).thenCall(
      (arg1, arg2) => {
        if (arg1.sub === user.id.toString() && arg2 === response) {
          return {
            authToken,
            refreshToken,
          };
        }
      },
    );

    //when
    when(userServiceMock.isActive(command.email)).thenResolve(true);
    await authService.login(command, response);

    //then
    const tokenServiceArgs = capture(
      tokenServiceMock.signAuthTokenPair,
    ).first();
    expect(tokenServiceArgs[0].sub).toBe(user.id.toString());
    expect(tokenServiceArgs[1]).toBe(response);
  });
  it('Returns user dto on login', async () => {
    //given
    const command = {
      email: 'boris.johnson@gmail.com',
      password: 'FuckEU1234',
    };
    const user: User = {
      id: randomId(),
      email: command.email,
      password: 'FuckEU1234!',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };
    const authToken = '3434';
    const refreshToken = '3434sdax1';
    const authTokenExpiration = 60;
    when(userServiceMock.findByEmail(command.email)).thenResolve(user);
    bcrypt.compareSync = jest.fn(
      (password, passwordHash) =>
        password === command.password && passwordHash === user.password,
    );
    when(userServiceMock.findByEmail(anything())).thenCall(
      (email) => email === user.email && user,
    );
    when(tokenServiceMock.signAuthTokenPair(anything(), anything())).thenCall(
      (arg1, arg2) => {
        if (arg1.sub === user.id.toString() && arg2 === response) {
          return {
            authToken,
            refreshToken,
          };
        }
      },
    );
    when(tokenServiceMock.authTokenExpiry).thenReturn(authTokenExpiration);

    //when
    when(userServiceMock.isActive(command.email)).thenResolve(true);
    const { id, authExpiresIn, name, email, validToISO } =
      await authService.login(command, response);

    //then
    expect(id.toString()).toBe(user.id.toString());
    expect(authExpiresIn).toBe(authTokenExpiration + 's');
    expect(name).toEqual(user.name);
    expect(email).toEqual(user.email);
    expect(validToISO).toBeDefined();
  });
  it('Adds auth & refresh tokens to cookies on token refresh', async () => {
    //given
    const user: User = {
      id: randomId(),
      email: 'foo@bar.com',
      password: '34dasdnasjdnj!',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };
    const authToken = '3434';
    const refreshToken = '3434sdax1';
    const authTokenExpiration = 60;
    when(userServiceMock.findById(anything())).thenCall(
      (id) => id.toString() === user.id.toString() && user,
    );
    when(tokenServiceMock.signAuthTokenPair(anything(), anything())).thenCall(
      (arg1, arg2) => {
        if (arg1.sub === user.id.toString() && arg2 === response) {
          return {
            authToken,
            refreshToken,
          };
        }
      },
    );
    when(tokenServiceMock.authTokenExpiry).thenReturn(authTokenExpiration);

    //when
    await authService.onRefreshToken(response, user.id.toString());

    //then
    const tokenServiceArgs = capture(
      tokenServiceMock.signAuthTokenPair,
    ).first();
    expect(tokenServiceArgs[0].sub).toBe(user.id.toString());
    expect(tokenServiceArgs[1]).toBe(response);
  });
  it('Returns user dto on token refresh', async () => {
    //given
    const user: User = {
      id: randomId(),
      email: 'foo@bar.com',
      password: '34dasdnasjdnj!',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };
    const authToken = '3434';
    const refreshToken = '3434sdax1';
    const authTokenExpiration = 60;
    when(userServiceMock.findById(anything())).thenCall(
      (id) => id.toString() === user.id.toString() && user,
    );
    when(tokenServiceMock.signAuthTokenPair(anything(), anything())).thenCall(
      (arg1, arg2) => {
        if (arg1.sub === user.id.toString() && arg2 === response) {
          return {
            authToken,
            refreshToken,
          };
        }
      },
    );
    when(tokenServiceMock.authTokenExpiry).thenReturn(authTokenExpiration);

    //when
    const { id, authExpiresIn, email, name, validToISO } =
      await authService.onRefreshToken(response, user.id.toString());

    //then
    expect(id.toString()).toBe(user.id);
    expect(authExpiresIn).toBe(authTokenExpiration + 's');
    expect(name).toEqual(user.name);
    expect(email).toEqual(user.email);
    expect(validToISO).toBeDefined();
  });
  it('Hashes refresh token on token refresh and saves user with the hash', async () => {
    //given
    const user: User = {
      id: randomId(),
      email: 'foo@bar.com',
      password: '34dasdnasjdnj!',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };
    const authToken = '3434';
    const bcryptSalt = '34433';
    const refreshTokenToHash = 'xczx!';
    const refreshTokenHashed = 'cxczczxczcer23';

    bcrypt.hashSync = jest.fn(
      (token, salt) =>
        token === refreshTokenToHash &&
        salt === bcryptSalt &&
        refreshTokenHashed,
    );
    when(envMock.BCRYPT_SALT).thenReturn(bcryptSalt);
    when(userServiceMock.findById(anything())).thenCall(
      (id) => id.toString() === user.id.toString() && user,
    );
    when(tokenServiceMock.signAuthTokenPair(anything(), anything())).thenCall(
      (arg1, arg2) => {
        if (arg1.sub === user.id.toString() && arg2 === response) {
          return {
            authToken,
            refreshToken: refreshTokenToHash,
          };
        }
      },
    );

    //when
    await authService.onRefreshToken(response, user.id.toString());
    //then
    const updateTokenArguments = capture(
      userServiceMock.updateRefreshTokenFor,
    ).first();
    expect(updateTokenArguments[1]).toBe(refreshTokenHashed);
  });
  it('Hashes refresh token on login and saves user with this hash', async () => {
    //given
    const command = {
      email: 'boris.johnson@gmail.com',
      password: 'FuckEU1234',
    };
    const user: User = {
      id: randomId(),
      email: 'boris.johnson@gmail.com',
      password: 'FuckEU1234',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };

    const authToken = '3434';
    const bcryptSalt = '34433';
    const refreshTokenToHash = 'xczx!';
    const refreshTokenHashed = 'cxczczxczcer23';

    bcrypt.hashSync = jest.fn(
      (token, salt) =>
        token === refreshTokenToHash &&
        salt === bcryptSalt &&
        refreshTokenHashed,
    );
    bcrypt.compareSync = jest.fn(
      (pass, hash) => pass == command.password && hash === user.password,
    );
    when(envMock.BCRYPT_SALT).thenReturn(bcryptSalt);
    when(userServiceMock.findByEmail(anything())).thenCall(
      (email) => email === user.email && user,
    );
    when(tokenServiceMock.signAuthTokenPair(anything(), anything())).thenCall(
      (arg1, arg2) => {
        if (arg1.sub === user.id.toString() && arg2 === response) {
          return {
            authToken,
            refreshToken: refreshTokenToHash,
          };
        }
      },
    );

    //when
    when(userServiceMock.isActive(command.email)).thenResolve(true);
    await authService.login(command, response);

    //then
    const updateTokenArguments = capture(
      userServiceMock.updateRefreshTokenFor,
    ).first();
    expect(updateTokenArguments[1]).toBe(refreshTokenHashed);
  });
  it('Returns user if token matches', async () => {
    //when
    const refreshTokenProvided = randomId();
    const user: User = {
      id: randomId(),
      email: 'foo@bar.com',
      password: '34dasdnasjdnj!',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };

    bcrypt.compareSync = jest.fn(
      (refreshToken, hashedToken) =>
        refreshToken === refreshTokenProvided &&
        hashedToken === user.refreshToken,
    );
    when(userServiceMock.findById(anything())).thenCall(
      (id) => id.toString() === user.id.toString() && user,
    );

    //when
    const actualUser = await authService.getUserIfTokenMatches(
      user.id.toString(),
      refreshTokenProvided,
    );

    //then
    expect(actualUser).toBe(user);
  });
  it('Doesnt return user when token doesnt match', async () => {
    //given
    const refreshTokenProvided = randomId().toString();
    const user: User = {
      id: randomId(),
      email: 'foo@bar.com',
      password: '34dasdnasjdnj!',
      name: 'Boris',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };

    bcrypt.compareSync = jest.fn(() => false);
    when(userServiceMock.findById(anything())).thenCall(
      (id) => id === user.id && user,
    );

    //when
    const actualUser = await authService.getUserIfTokenMatches(
      user.id.toString(),
      refreshTokenProvided,
    );

    //then
    expect(actualUser).toBeFalsy();
  });
  it('Creates new user with hashed password on register', async () => {
    //given
    const command: RegisterUserCommand = {
      email: 'macmiller@gmail.com',
      name: 'Mac',
      password: '3432432432',
    };
    const publicDomain = 'stg.vappy.io';
    when(envMock.PUBLIC_DOMAIN).thenReturn(publicDomain);
    const user: User = {
      id: randomId(),
      email: 'foo@bar.com',
      password: '3432432432',
      name: 'Mac',
      active: true,
      registrationMethod: RegistrationMethod.manual,
    };

    const datetime = new Date();
    datetime.setHours(datetime.getHours() + 48);

    const registrationToken: RegistrationToken = {
      id: randomId(),
      userId: user.id,
      activationGuid: randomId(),
      guidValidTo: datetime.toISOString(),
    };

    const hashedPassword = '213213213213123213$refds';
    const bcryptSalt = '34342';
    when(envMock.BCRYPT_SALT).thenReturn(bcryptSalt);
    bcrypt.hashSync = jest.fn(
      (pass, salt) =>
        pass === command.password && salt === bcryptSalt && hashedPassword,
    );

    //when
    when(
      userServiceMock.createNew(
        deepEqual({
          email: command.email,
          password: hashedPassword,
          name: command.name,
          registrationMethod: user.registrationMethod,
        }),
      ),
    ).thenResolve({
      user: user,
      registrationToken: registrationToken,
    });
    await authService.register(command);

    //then
    const savedUser = capture(userServiceMock.createNew).first()[0];
    const emailUrl = capture(
      emailServiceMock.sendAccountConfirmation,
    ).last()[1];
    expect(savedUser.name).toBe(command.name);
    expect(savedUser.email).toBe(command.email);
    expect(savedUser.password).toBe(hashedPassword);
    expect(savedUser.registrationMethod).toEqual(RegistrationMethod.manual);
    expect(emailUrl).toContain(`${publicDomain}/pl/account/confirm-account/`);
  });
  it('Creates new user on login with google if user does not exist yet', async () => {
    // given
    const user: User = {
      id: randomId(),
      name: 'Adam',
      email: 'adam@gmail.com',
      active: true,
      registrationMethod: RegistrationMethod.google,
    };
    const refreshToken = randomId();
    const loginWithGoogle: LoginWithGoogleCommand = {
      email: user.email,
      idToken: '33',
    };

    const loginTicket: Partial<LoginTicket> = {
      getPayload(): TokenPayload | undefined {
        return {
          aud: '',
          exp: 0,
          iat: 0,
          iss: '',
          sub: '',
          email: user.email,
          name: user.name,
        };
      },
    };
    const googleAuthId = '3';
    when(envMock.GOOGLE_AUTH_ID).thenReturn(googleAuthId);
    googleAuthClientMock.verifyIdToken.mockImplementation(
      async ({ idToken, audience }) => {
        if (idToken === loginWithGoogle.idToken && audience === googleAuthId)
          return loginTicket;
      },
    );

    when(userServiceMock.findByEmail(loginWithGoogle.email)).thenResolve(
      undefined,
    );
    when(
      userServiceMock.createNew(
        deepEqual({
          email: user.email,
          name: user.name,
          registrationMethod: RegistrationMethod.google,
        }),
      ),
    ).thenResolve({ user });
    when(
      tokenServiceMock.signAuthTokenPair(
        deepEqual({
          sub: user.id,
        }),
        anything(),
      ),
    ).thenResolve({
      authToken: '2',
      refreshToken,
    });
    when(tokenServiceMock.authTokenExpiry).thenReturn(50);

    // when
    const response = await authService.loginWithGoogle(
      loginWithGoogle,
      responseMock,
    );

    // then
    expect(response.id).toEqual(user.id);
    expect(response.name).toEqual(user.name);
    expect(response.email).toEqual(user.email);
    expect(response.authExpiresIn).toEqual('50s');
  });
  it('Resends account confirmation link if user is not active', async () => {
    // given
    const id = randomId();
    when(envMock.PUBLIC_DOMAIN).thenReturn('stg.vappy.io');
    const user: User = {
      id,
      name: 'Mike',
      registrationMethod: RegistrationMethod.manual,
      email: 'mike@gmail.com',
      password: 'foo',
      active: false,
    };
    const token: RegistrationToken = {
      id: randomId(),
      userId: user.id,
      activationGuid: randomId(),
      guidValidTo: new Date().toISOString(),
    };
    const oldDate = new Date();
    oldDate.setHours(oldDate.getHours() - 48);
    const oldToken: RegistrationToken = {
      id: randomId(),
      userId: user.id,
      activationGuid: randomId(),
      guidValidTo: oldDate.toISOString(),
    };
    when(
      userServiceMock.findRegistrationTokenByActivationGuid(
        oldToken.activationGuid,
      ),
    ).thenResolve(oldToken);
    when(userServiceMock.findById(id)).thenResolve(user);
    when(
      userServiceMock.generateRegistrationTokenFor(deepEqual(user)),
    ).thenResolve(token);

    // when
    await authService.resendAccountConfirmationLink({
      activationGuid: oldToken.activationGuid,
    });

    // then
    const sendAccountConfirmationArgs = capture(
      emailServiceMock.sendAccountConfirmation,
    ).last();
    expect(sendAccountConfirmationArgs[0]).toEqual(user);
    expect(sendAccountConfirmationArgs[1]).toEqual(
      `${
        env.PUBLIC_DOMAIN
      }/${langServiceMock.language.toLowerCase()}/account/confirm-account/${
        token.activationGuid
      }`,
    );
    expect(sendAccountConfirmationArgs[2]).toEqual('PL');
  });
  it('Throws exception on resend account confirmation link when token does not exist', async () => {
    const tokenGuid = randomId();
    when(
      userServiceMock.findRegistrationTokenByActivationGuid(tokenGuid),
    ).thenResolve(undefined);

    try {
      await authService.resendAccountConfirmationLink(tokenGuid);
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(SecurityException);
      expect((err as SecurityException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_ACTIVATION_GUID,
      );
    }
  });
  it('Throws exception on resend account confirmation link when user is already active', async () => {
    // given
    const id = randomId();
    const user: User = {
      id,
      name: 'Mike',
      registrationMethod: RegistrationMethod.manual,
      email: 'mike@gmail.com',
      password: 'foo',
      active: true,
    };
    const oldDate = new Date();
    oldDate.setHours(oldDate.getHours() - 48);
    const oldToken: RegistrationToken = {
      id: randomId(),
      userId: user.id,
      activationGuid: randomId(),
      guidValidTo: oldDate.toISOString(),
    };
    const userId = randomId();
    when(
      userServiceMock.findRegistrationTokenByActivationGuid(
        oldToken.activationGuid,
      ),
    ).thenResolve(oldToken);
    when(userServiceMock.findById(oldToken.userId)).thenResolve({
      id: userId,
      active: true,
    } as User);

    try {
      await authService.resendAccountConfirmationLink({
        activationGuid: oldToken.activationGuid,
      });
      fail();
    } catch (err) {
      expect(err).toBeInstanceOf(SecurityException);
      expect((err as SecurityException).messageProps.messageKey).toEqual(
        MessageCode.USER_IS_ALREADY_ACTIVE,
      );
    }
  });

  it('Changes password', async () => {
    const id = '123';
    const user: User = {
      id,
      name: 'Ali',
      registrationMethod: RegistrationMethod.manual,
      email: 'ali@gmail.com',
      password: 'agca',
      active: true,
    };
    when(userServiceMock.findById(anything())).thenResolve(user);
    user.password = 'newpassword';
    when(userServiceMock.changePassword(anything(), 'newpassword')).thenResolve(
      user,
    );
    bcrypt.compareSync = jest.fn(() => {
      return true;
    });
    await authService.changePassword(
      { oldPassword: '123', newPassword: 'new123' },
      id,
    );
  });

  it('Throws exception when old password incorrect during password change', async () => {
    when(userServiceMock.findById(anything())).thenReturn(undefined);
    bcrypt.compareSync = jest.fn(() => {
      return false;
    });
    try {
      await authService.changePassword(
        { oldPassword: '123', newPassword: 'new123' },
        '123456',
      );
    } catch (err) {
      expect(err).toBeInstanceOf(SecurityException);
      expect((err as SecurityException).messageProps.messageKey).toEqual(
        MessageCode.INVALID_PASSWORD,
      );
    }
  });
});
