import { JwtService } from '@nestjs/jwt';
import { anything, capture, instance, mock, reset, when } from 'ts-mockito';
import { TokenService } from '../../../../src/infrastructure/security/token.service';
import { CookieService } from '../../../../src/infrastructure/security/cookie.service';
import { Request, Response } from 'express';
import Tokens from 'csrf';
import { v4 as uuid } from 'uuid';
import { Environment } from '../../../../src/configuration.module';

describe('Token service', () => {
  const randomId = () => uuid();
  const jwtServiceMock = mock(JwtService);
  const jwtService = instance(jwtServiceMock);
  const envMock = mock(Environment);
  const env = instance(envMock);
  const requestObjectMock = mock<Request>();
  const request = instance(requestObjectMock);
  const responseObjectMock = mock<Response>();
  const response = instance(responseObjectMock);
  const tokensMock = mock<Tokens>();
  const tokens = instance(tokensMock);
  const cookieServiceMock = mock(CookieService);
  const cookieService = instance(cookieServiceMock);
  const tokenService = new TokenService(env, jwtService, cookieService, tokens);
  const requestHeaderWithCsrfCookieAndToken = () => {
    const tokenHttpHeaderValue = randomId().toString();
    const signedSecret = randomId().toString();
    const headers = {
      cookie: `${CookieService.CSRF_TOKEN_COOKIE_NAME}=${signedSecret}`,
      [TokenService.CSRF_TOKEN_HEADER_NAME]: tokenHttpHeaderValue,
    };

    return {
      headers,
      tokenHttpHeaderValue,
      signedSecret,
      decodedSecret: randomId().toString(),
    };
  };

  beforeEach(() => {
    reset<unknown>(
      jwtServiceMock,
      envMock,
      responseObjectMock,
      responseObjectMock,
      tokensMock,
    );
  });
  it('Signs auth token pair using different secret and config', async () => {
    // given
    const token = '1234';
    const signedAuthToken = 'XXDsdsa';
    const signedRefreshToken = '434sdxs#123';
    const authTokenExpiry = 900;
    const authTokenSecret = 'authSecret!1232';
    const refreshTokenSecret = 'refreshSecret213213';
    const refreshTokenExpiry = 123323;

    when(envMock.JWT_SECRET).thenReturn(authTokenSecret);

    when(envMock.JWT_REFRESH_TOKEN_SECRET).thenReturn(refreshTokenSecret);

    when(envMock.JWT_EXPIRY).thenReturn(authTokenExpiry);

    when(envMock.JWT_REFRESH_EXPIRY).thenReturn(refreshTokenExpiry);
    when(jwtServiceMock.sign(anything(), anything()))
      .thenReturn(signedAuthToken)
      .thenReturn(signedRefreshToken);

    //when
    const {
      authToken: actualSignedAuthToken,
      refreshToken: actualSignedRefreshToken,
    } = await tokenService.signAuthTokenPair({ sub: token }, response);

    //then
    const [authTokenPassedToSign, authTokenOptions] = capture(
      jwtServiceMock.sign,
    ).first();
    const [refreshTokenPassedToSign, refreshTokenOptions] = capture(
      jwtServiceMock.sign,
    ).second();
    expect(authTokenPassedToSign['sub']).toBe(token);
    expect(refreshTokenPassedToSign['sub']).toBe(token);
    expect(authTokenOptions['secret']).toBe(authTokenSecret);
    expect(authTokenOptions['expiresIn']).toBe(authTokenExpiry + 's');
    expect(refreshTokenOptions['secret']).toBe(refreshTokenSecret);
    expect(refreshTokenOptions['expiresIn']).toBe(refreshTokenExpiry + 's');
    expect(actualSignedAuthToken).toBe(signedAuthToken);
    expect(actualSignedRefreshToken).toBe(signedRefreshToken);
  });
  it('Signs csrf token pair using csrf token config', () => {
    // given
    const token = '1234';
    const signedCsrfToken = 'XXDsdsa';

    const csrfTokenExpiry = '60';
    const csrfTokenSecret = 'authSecret!1232';

    when(envMock.CSRF_TOKEN_SECRET).thenReturn(csrfTokenSecret);
    when(envMock.CSRF_TOKEN_EXPIRY).thenReturn(csrfTokenExpiry);
    when(jwtServiceMock.sign(anything(), anything())).thenReturn(
      signedCsrfToken,
    );

    //when
    const actualSignedCsrfToken = tokenService.signCsrfToken({ sub: token });

    //then
    const [authTokenPassedToSign, authTokenOptions] = capture(
      jwtServiceMock.sign,
    ).first();
    expect(authTokenPassedToSign['sub']).toBe(token);
    expect(authTokenOptions['secret']).toBe(csrfTokenSecret);
    expect(authTokenOptions['expiresIn']).toBe(csrfTokenExpiry + 's');
    expect(signedCsrfToken).toBe(actualSignedCsrfToken);
  });
  it('Validates CSRF Token signature using CSRF Token secret', () => {
    //given
    const tokenToValidate = '3421343';
    const decodedToken = 'abc';

    const csrfTokenSecret = 'authSecret!1232';
    when(jwtServiceMock.verify<any>(tokenToValidate, anything())).thenReturn(
      decodedToken,
    );
    when(envMock.CSRF_TOKEN_SECRET).thenReturn(csrfTokenSecret);
    //when
    const actualDecodedToken =
      tokenService.validateAndDecodeCsrfToken(tokenToValidate);

    //then
    const [tokenPassedToVerify, tokenSignatureOptions] = capture(
      jwtServiceMock.verify,
    ).first();
    expect(actualDecodedToken).toBe(decodedToken);
    expect(tokenPassedToVerify).toBe(tokenToValidate);
    expect(tokenSignatureOptions['secret']).toBe(csrfTokenSecret);
  });
  it('Takes expiration from config', () => {
    const csrfTokenExpiry = '60';
    const authTokenExpiry = 34343;
    const refreshTokenExpiry = 666;
    when(envMock.CSRF_TOKEN_EXPIRY).thenReturn(csrfTokenExpiry);
    when(envMock.JWT_EXPIRY).thenReturn(authTokenExpiry);

    when(envMock.JWT_REFRESH_EXPIRY).thenReturn(refreshTokenExpiry);
    //when + then
    expect(tokenService.csrfTokenExpiry).toBe(csrfTokenExpiry);
    expect(tokenService.authTokenExpiry).toBe(authTokenExpiry);
    expect(tokenService.refreshTokenExpiry).toBe(refreshTokenExpiry);
  });
  it('should generate CSRF token and set cookie with a secret', async () => {
    // given
    const tokenSecret = '1234';
    const token = '56789';
    const signedSecret = 'XXX';
    when(tokensMock.secretSync()).thenReturn(tokenSecret);
    when(tokensMock.create(tokenSecret)).thenReturn(token);
    when(jwtServiceMock.sign(anything(), anything())).thenCall((args) => {
      if (args['sub'] === tokenSecret) {
        return signedSecret;
      }
    });
    //when
    const result = tokenService.generateCsrfToken(response);

    //then
    expect(capture(jwtServiceMock.sign).first()[0]['sub']).toBe(tokenSecret);
    const [responseForCookie, tokenForCookie] = capture(
      cookieServiceMock.addCsrfCookie,
    ).last();
    expect(responseForCookie).toBe(response);
    expect(tokenForCookie).toBe(signedSecret);
    expect(result).toBe(token);
  });
  it('should return true if CSRF token is indeed valid', async () => {
    //given
    const tokenHttpHeaderValue = '1234';
    const signedSecret = 'XXX';
    const decodedSecret = '2133';
    const headers = {
      cookie: `${CookieService.CSRF_TOKEN_COOKIE_NAME}=${signedSecret}`,
    };
    headers[TokenService.CSRF_TOKEN_HEADER_NAME] = tokenHttpHeaderValue;
    when(requestObjectMock.headers).thenReturn(headers);
    when(cookieServiceMock.extractCsrfCookieFromReq(request)).thenReturn(
      signedSecret,
    );
    when<string>(jwtServiceMock.verify(anything(), anything())).thenCall(
      (args) => args === signedSecret && { sub: decodedSecret },
    );
    when(tokensMock.verify(decodedSecret, tokenHttpHeaderValue)).thenReturn(
      true,
    );

    //when
    const result = tokenService.validCsrfToken(request);

    //then
    expect(result).toBe(true);
  });

  it('should return false on validate CSRF Token when missing secret cookie', async () => {
    //given
    const { headers } = requestHeaderWithCsrfCookieAndToken();
    headers[CookieService.CSRF_TOKEN_COOKIE_NAME] = undefined;

    when(cookieServiceMock.extractCsrfCookieFromReq(anything())).thenReturn(
      undefined,
    );

    //when
    const result = tokenService.validCsrfToken(request);

    //then
    expect(result).toBe(false);
  });

  it('should return false on validate CSRF Token when missing header with token', async () => {
    //given
    const { headers, decodedSecret, signedSecret } =
      requestHeaderWithCsrfCookieAndToken();
    headers[TokenService.CSRF_TOKEN_HEADER_NAME] = undefined;

    when(cookieServiceMock.extractCsrfCookieFromReq(anything())).thenReturn(
      signedSecret,
    );
    when<string>(jwtServiceMock.verify(anything(), anything())).thenCall(
      (args) => args === signedSecret && { sub: decodedSecret },
    );
    when(tokensMock.verify(decodedSecret, anything())).thenReturn(false);

    //when
    const result = tokenService.validCsrfToken(request);

    //then
    expect(result).toBe(false);
  });

  it('should return false on CSRF token check when secret from cookie is invalid', async () => {
    //given
    const { headers, signedSecret } = requestHeaderWithCsrfCookieAndToken();
    when(requestObjectMock.headers).thenReturn(headers);
    when(cookieServiceMock.extractCsrfCookieFromReq(request)).thenReturn(
      signedSecret,
    );
    when<string>(jwtServiceMock.verify(signedSecret, anything())).thenThrow(
      new Error('invalid token'),
    );
    //when
    const result = tokenService.validCsrfToken(request);

    //then
    expect(result).toBe(false);
  });

  it('should return false when CSRF token was not generated with secret from cookie', async () => {
    //given
    const { headers, tokenHttpHeaderValue, decodedSecret, signedSecret } =
      requestHeaderWithCsrfCookieAndToken();
    when(requestObjectMock.headers).thenReturn(headers);
    when(cookieServiceMock.extractCsrfCookieFromReq(request)).thenReturn(
      signedSecret,
    );
    when<string>(jwtServiceMock.verify(anything(), anything())).thenCall(
      (args) => {
        if (args === signedSecret) {
          return { sub: decodedSecret };
        }
      },
    );
    when(tokensMock.verify(decodedSecret, tokenHttpHeaderValue)).thenReturn(
      false,
    );

    //when
    const result = tokenService.validCsrfToken(request);

    //then
    expect(result).toBe(false);
  });

  it('propagates exception', async () => {
    try {
      when(jwtServiceMock.sign(anything(), anything())).thenThrow(
        new Error('jwt service error'),
      );
      tokenService.generateCsrfToken(undefined);
      fail('Exception was not thrown');
    } catch (e) {}
  });
});
