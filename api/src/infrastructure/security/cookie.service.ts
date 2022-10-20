import * as Cookies from 'cookie';
import { Request, Response } from 'express';
import { IncomingMessage } from 'http';

export class CookieService {
  static readonly AUTH_COOKIE_NAME = '_JC';

  static readonly AUTH_REFRESH_COOKIE_NAME = '_JR';

  static readonly CSRF_TOKEN_COOKIE_NAME = '_csrf';

  static readonly WS_TOKEN_COOKIE_NAME = '_ws';

  addAuthCookie(
    response: Response,
    authToken: string,
    refreshToken: string,
    authTokenExpiry,
    refreshTokenExpiry,
  ) {
    CookieService.setCookie(
      response,
      CookieService.AUTH_COOKIE_NAME,
      authToken,
      authTokenExpiry,
    );
    CookieService.setCookie(
      response,
      CookieService.AUTH_REFRESH_COOKIE_NAME,
      refreshToken,
      refreshTokenExpiry,
    );
  }

  addCsrfCookie(response: Response, csrfToken: string, expiry) {
    CookieService.setCookie(
      response,
      CookieService.CSRF_TOKEN_COOKIE_NAME,
      csrfToken,
      expiry,
    );
  }

  addWsCookie(response: Response, wsToken: string, expiry) {
    CookieService.setCookie(
      response,
      CookieService.WS_TOKEN_COOKIE_NAME,
      wsToken,
      expiry,
    );
  }

  clearAll(response: Response) {
    const cookieOptions = {
      httpOnly: true,
      maxAge: 0,
      path: '/',
    };
    response.setHeader('Set-Cookie', [
      Cookies.serialize(CookieService.AUTH_COOKIE_NAME, '', cookieOptions),
      Cookies.serialize(
        CookieService.AUTH_REFRESH_COOKIE_NAME,
        '',
        cookieOptions,
      ),
      Cookies.serialize(
        CookieService.CSRF_TOKEN_COOKIE_NAME,
        '',
        cookieOptions,
      ),
    ]);
  }

  extractRefreshCookieFromReq(request: Request): string | null {
    return CookieService.getCookiesFromHeaders(
      request,
      CookieService.AUTH_REFRESH_COOKIE_NAME,
    );
  }

  extractAuthCookieFromReq(request: Request): string | null {
    return CookieService.getCookiesFromHeaders(
      request,
      CookieService.AUTH_COOKIE_NAME,
    );
  }

  extractCsrfCookieFromReq(request: Request): string | null {
    const cookies = Cookies.parse(request.headers?.cookie || '');
    return cookies[CookieService.CSRF_TOKEN_COOKIE_NAME];
  }

  extractWsCookieFromMessage(message: IncomingMessage) {
    const cookies = Cookies.parse(message.headers['cookie'] || '');
    return cookies[CookieService.WS_TOKEN_COOKIE_NAME];
  }

  private static setCookie(
    response: Response,
    name: string,
    value: string,
    age: number,
  ) {
    const cookie = Cookies.serialize(name, value, {
      httpOnly: true,
      path: '/',
      maxAge: age,
      secure: true,
    });
    const previousHeaders = (response.getHeader('Set-Cookie') ||
      []) as string[];
    const header = Array.isArray(previousHeaders)
      ? previousHeaders.concat(cookie)
      : [previousHeaders, cookie];
    response.setHeader('Set-Cookie', header);
  }

  private static getCookiesFromHeaders(request: Request, cookieName: string) {
    const cookie = request.cookies && request.cookies[cookieName];
    if (cookie) {
      return cookie;
    }
    const cookiesFromHeaders = Cookies.parse(request.headers?.cookie || '');
    return cookiesFromHeaders ? cookiesFromHeaders[cookieName] : null;
  }
}
