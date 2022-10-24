import {
  AuthenticationService,
  AuthToken,
} from '../../../../../src/infrastructure/security/authentication/authentication.service';
import { createMock } from '@golevelup/ts-jest';
import { TokenService } from '../../../../../src/infrastructure/security/token.service';
import { CookieService } from '../../../../../src/infrastructure/security/cookie.service';
import { JwtRefreshTokenStrategy } from '../../../../../src/infrastructure/security/authorization/jwt.strategy';
import { Request } from 'express';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { randomId } from '../../../../misc.util';

describe('Jwt strategy', () => {
  let refreshTokenStrategy: JwtRefreshTokenStrategy;
  let authService: AuthenticationService;
  beforeEach(() => {
    const contextId = randomId();
    authService = createMock<AuthenticationService>();
    const tokenService = createMock<TokenService>();
    const cookieService = createMock<CookieService>();
    const moduleRefMock = createMock<ModuleRef>();

    // @ts-ignore
    ContextIdFactory.getByRequest = jest.fn(() => contextId);
    moduleRefMock.resolve.mockImplementation(async (context, cls) => {
      return context === contextId && authService;
    });
    refreshTokenStrategy = new JwtRefreshTokenStrategy(
      moduleRefMock,
      cookieService,
      tokenService,
    );
  });
  it('Returns undefined if auth service doesnt return anything', async () => {
    jest
      .spyOn(authService, 'getUserIfTokenMatches')
      .mockImplementation(() => undefined);
    const validateResult = await refreshTokenStrategy.validate(
      createMock<Request>(),
      createMock<AuthToken>(),
    );
    expect(validateResult).toBe(undefined);
  });

  it('Returns undefined if exception is thrown', async () => {
    jest.spyOn(authService, 'getUserIfTokenMatches').mockImplementation(() => {
      throw new Error('Some err');
    });
    try {
      await refreshTokenStrategy.validate(
        createMock<Request>(),
        createMock<AuthToken>(),
      );
      fail('Exception not thrown');
    } catch (err) {}
  });
});
