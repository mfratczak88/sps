import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CookieService } from '../../../../../src/infrastructure/security/cookie.service';
import { AuthenticationService } from '../../../../../src/infrastructure/security/authentication/authentication.service';
import { TokenService } from '../../../../../src/infrastructure/security/token.service';
import { CurrentUserInterceptor } from '../../../../../src/infrastructure/web/interceptor/current-user.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Role } from '../../../../../src/infrastructure/security/authorization/role';
import { User } from '../../../../../src/infrastructure/security/user/user';
import { RequestWithUser } from '../../../../../src/infrastructure/security/authorization/jwt.strategy';

describe('Current user interceptor', () => {
  let cookieServiceMock: DeepMocked<CookieService>;
  let authServiceMock: DeepMocked<AuthenticationService>;
  let tokenServiceMock: DeepMocked<TokenService>;
  let contextMock: DeepMocked<ExecutionContext>;
  let callHandlerMock: DeepMocked<CallHandler>;
  let interceptor: CurrentUserInterceptor;
  const requestWithUser: Partial<RequestWithUser> = {};
  beforeEach(() => {
    cookieServiceMock = createMock<CookieService>();
    authServiceMock = createMock<AuthenticationService>();
    tokenServiceMock = createMock<TokenService>();
    contextMock = createMock<ExecutionContext>();
    callHandlerMock = createMock<CallHandler>();
    contextMock.switchToHttp().getRequest.mockReturnValue(requestWithUser);
    interceptor = new CurrentUserInterceptor(
      cookieServiceMock,
      authServiceMock,
      tokenServiceMock,
    );
  });
  it('extracts tokens from request and fetches user from auth service', async () => {
    // given
    const refreshToken = '1234';
    const decodedRefreshToken = {
      sub: 'abc',
    };
    authServiceMock.getUserIfTokenMatches.mockResolvedValue({
      id: 'some-id',
      role: Role.ADMIN,
    } as User);
    cookieServiceMock.extractRefreshCookieFromReq.mockReturnValue(refreshToken);
    tokenServiceMock.validateAndDecodeRefreshToken.mockReturnValue(
      decodedRefreshToken,
    );

    // when
    await interceptor.intercept(contextMock, callHandlerMock);

    // then
    expect(cookieServiceMock.extractRefreshCookieFromReq).toHaveBeenCalledWith(
      requestWithUser,
    );
    expect(tokenServiceMock.validateAndDecodeRefreshToken).toHaveBeenCalledWith(
      refreshToken,
    );
    expect(authServiceMock.getUserIfTokenMatches).toHaveBeenCalledWith(
      decodedRefreshToken.sub,
      refreshToken,
    );
    expect(requestWithUser.user).toEqual({
      id: 'some-id',
      role: Role.ADMIN,
    });
  });
});
