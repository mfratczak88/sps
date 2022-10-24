import { CookieService } from '../../../../src/infrastructure/security/cookie.service';
import { capture, instance, mock, reset, when } from 'ts-mockito';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';

describe('Cookie service', () => {
  const requestMock = mock<Request>();
  const request = instance(requestMock);
  const responseMock = mock<Response>();
  const response = instance(responseMock);
  const cookieService = new CookieService();

  beforeEach(() => {
    reset<unknown>(responseMock, requestMock);
  });
  it('Appends header to the existing ones', () => {
    const existingCookie = 'xyz=1234';
    const authToken = '123';
    const refreshToken = 'ABC';
    const csrfToken = 'abc';
    const wsToken = '4523fd#';
    const refreshTokenExpiry = '60';
    const authTokenExpiry = '70';
    const csrfTokenExpiry = '80';
    const wsTokenExpiry = '90';
    when(responseMock.getHeader('Set-Cookie')).thenReturn(existingCookie);

    cookieService.addAuthCookie(
      response,
      authToken,
      refreshToken,
      authTokenExpiry,
      refreshTokenExpiry,
    );
    cookieService.addCsrfCookie(response, csrfToken, csrfTokenExpiry);
    cookieService.addWsCookie(response, wsToken, wsTokenExpiry);
    const [headerName, headerValue] = capture(responseMock.setHeader).last();
    const actualCookies = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    expect(headerName).toBe('Set-Cookie');
    expect(
      [
        ...existingCookie,
        `${CookieService.AUTH_COOKIE_NAME}=${authToken}`,
        `${CookieService.AUTH_REFRESH_COOKIE_NAME}=${refreshToken}`,
        `${CookieService.CSRF_TOKEN_COOKIE_NAME}=${csrfToken}`,
        `${CookieService.WS_TOKEN_COOKIE_NAME}=${wsToken}`,
      ].every((expectedCookie) => actualCookies.includes(expectedCookie)),
    );
  });
  it('Takes correct expiration for auth tokens', () => {
    // given
    const authToken = '123';
    const refreshToken = 'ABC';
    const authTokenExpiry = '60';
    const refreshTokenExpiry = '4333';
    when(responseMock.getHeader('Set-Cookie')).thenReturn([]);

    //when
    cookieService.addAuthCookie(
      response,
      authToken,
      refreshToken,
      authTokenExpiry,
      refreshTokenExpiry,
    );

    //then
    let [, headerValue] = capture(responseMock.setHeader).first();
    const actualCookiesForAuthToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    [, headerValue] = capture(responseMock.setHeader).second();
    const actualCookiesForRefreshToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    expect(
      actualCookiesForAuthToken.includes(`Max-Age=${authTokenExpiry}`),
    ).toBe(true);
    expect(
      actualCookiesForRefreshToken.includes(`Max-Age=${refreshTokenExpiry}`),
    ).toBe(true);
  });
  it('Takes correct expiration for CSRF Token', () => {
    // given
    const csrfToken = '123';
    const csrfTokenExpiry = '60';
    when(responseMock.getHeader('Set-Cookie')).thenReturn([]);

    //when
    cookieService.addCsrfCookie(response, csrfToken, csrfTokenExpiry);

    //then
    const [, headerValue] = capture(responseMock.setHeader).first();
    const actualCookiesForAuthToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    expect(
      actualCookiesForAuthToken.includes(`Max-Age=${csrfTokenExpiry}`),
    ).toBe(true);
  });
  it('Takes correct expiration for WS Token', () => {
    // given
    const wsToken = '123';
    const wsTokenExpiry = '60';
    when(responseMock.getHeader('Set-Cookie')).thenReturn([]);

    //when
    cookieService.addWsCookie(response, wsToken, wsTokenExpiry);

    //then
    const [, headerValue] = capture(responseMock.setHeader).first();
    const actualCookiesForAuthToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    expect(actualCookiesForAuthToken.includes(`Max-Age=${wsTokenExpiry}`)).toBe(
      true,
    );
  });
  it('Extracts CSRF Token cookie from request', () => {
    //given
    const actualCsrfToken = '1234';
    const headers: IncomingHttpHeaders = {};
    headers[
      'cookie'
    ] = `${CookieService.CSRF_TOKEN_COOKIE_NAME}=${actualCsrfToken}`;
    when(requestMock.headers).thenReturn(headers);
    //when
    const extractedCsrfToken = cookieService.extractCsrfCookieFromReq(request);
    //then
    expect(extractedCsrfToken).toBe(actualCsrfToken);
  });
  it('Extracts WS Token cookie from request', () => {
    //given
    const actualWsToken = '3434sfdxc#@4';
    const headers: IncomingHttpHeaders = {};
    headers[
      'cookie'
    ] = `${CookieService.WS_TOKEN_COOKIE_NAME}=${actualWsToken}`;
    when(requestMock.headers).thenReturn(headers);
    //when
    const extractedCsrfToken =
      cookieService.extractWsCookieFromMessage(request);
    //then
    expect(extractedCsrfToken).toBe(actualWsToken);
  });
  it('Extracts Auth token cookie from request', () => {
    // given
    const actualAuthToken = '1234';
    const cookies = {
      [CookieService.AUTH_COOKIE_NAME]: actualAuthToken,
    };

    when(requestMock.cookies).thenReturn(cookies);
    //when
    const extractedAuthToken = cookieService.extractAuthCookieFromReq(request);
    //then
    expect(extractedAuthToken).toBe(actualAuthToken);
  });
  it('Extracts Refresh token cookie from request', () => {
    //given
    const actualRefreshToken = '1234';
    const cookies = {
      [CookieService.AUTH_COOKIE_NAME]: actualRefreshToken,
    };
    when(requestMock.cookies).thenReturn(cookies);
    //when
    const extractedRefreshToken =
      cookieService.extractAuthCookieFromReq(request);

    //then
    expect(extractedRefreshToken).toBe(actualRefreshToken);
  });
  it('Sets all cookies httpOnly, secure, path=/', () => {
    const authToken = '123';
    const authTokenExpiry = '60';
    const refreshToken = 'ABC';
    const refreshTokenExpiry = '454';
    const csrfToken = '12333232';
    const csrfTokenExpiry = '565';
    const wsToken = '342cxczxcq34241!';
    const wsTokenExpiry = '6554';
    when(responseMock.getHeader('Set-Cookie')).thenReturn([]);

    //when
    cookieService.addAuthCookie(
      response,
      authToken,
      refreshToken,
      authTokenExpiry,
      refreshTokenExpiry,
    );
    cookieService.addCsrfCookie(response, csrfToken, csrfTokenExpiry);
    cookieService.addWsCookie(response, wsToken, wsTokenExpiry);
    //then
    let [, headerValue] = capture(responseMock.setHeader).first();
    const actualCookiesForAuthToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    [, headerValue] = capture(responseMock.setHeader).second();
    const actualCookiesForRefreshToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    [, headerValue] = capture(responseMock.setHeader).third();
    const actualCookiesForCsrfToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    [, headerValue] = capture(responseMock.setHeader).last();
    const actualCookiesForWsToken = (<string[]>headerValue)
      .flatMap((x) => x.split(';'))
      .flatMap((cookieKeyAndValue) => cookieKeyAndValue.trim());

    expect(actualCookiesForAuthToken.includes(`HttpOnly`)).toBe(true);
    expect(actualCookiesForRefreshToken.includes(`HttpOnly`)).toBe(true);
    expect(actualCookiesForCsrfToken.includes(`HttpOnly`)).toBe(true);
    expect(actualCookiesForWsToken.includes(`HttpOnly`)).toBe(true);

    expect(actualCookiesForAuthToken.includes(`Path=/`)).toBe(true);
    expect(actualCookiesForRefreshToken.includes(`Path=/`)).toBe(true);
    expect(actualCookiesForCsrfToken.includes(`Path=/`)).toBe(true);
    expect(actualCookiesForWsToken.includes(`Path=/`)).toBe(true);

    expect(actualCookiesForAuthToken.includes(`Secure`)).toBe(true);
    expect(actualCookiesForRefreshToken.includes(`Secure`)).toBe(true);
    expect(actualCookiesForCsrfToken.includes(`Secure`)).toBe(true);
    expect(actualCookiesForWsToken.includes(`Secure`)).toBe(true);
  });
  it('Returns falsy value when request doesnt have cookies prop', async () => {
    when(requestMock.cookies).thenReturn(undefined);

    expect(cookieService.extractRefreshCookieFromReq(request)).toBeFalsy();
    expect(cookieService.extractAuthCookieFromReq(request)).toBeFalsy();
  });
});
