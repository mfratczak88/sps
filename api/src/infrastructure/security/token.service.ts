import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Tokens from 'csrf';
import { CookieService } from './cookie.service';
import { Request, Response } from 'express';

import { Environment } from '../../configuration.module';

@Injectable()
export class TokenService {
  static readonly CSRF_TOKEN_HEADER_NAME = 'x-csrf-token';

  private token = new Tokens({});

  constructor(
    private readonly env: Environment,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
    token?: Tokens,
  ) {
    this.token = token || new Tokens({});
  }

  async signAuthTokenPair(token: Token, response: Response) {
    const authToken = this.signAuthToken(token);
    const refreshToken = this.signRefreshToken(token);
    this.cookieService.addAuthCookie(
      response,
      authToken,
      refreshToken,
      this.authTokenExpiry,
      this.refreshTokenExpiry,
    );
    return {
      authToken,
      refreshToken,
    };
  }

  /**
   * Short-lived token generation
   *    1. Generate token, one for each request
   *    2. Set cookie http only with the value of the jwt signed secret used to generate the token
   *       (we're signing it, to be 100% sure that it has not been tampered with,
   *        it needs to have the secret right and correct expiration date)
   *    3. Send back the token to the user, together with the signed secret in cookie
   *
   * Validation
   *    1. Get token from header
   *    2. Get secret from cookie
   *    3. verify jwt signature on secret and decode it
   *    4. check if token was signed using secret
   */

  signCsrfToken(token: CsrfToken) {
    return this.jwtService.sign(token, {
      secret: this.env.CSRF_TOKEN_SECRET,
      expiresIn: `${this.env.CSRF_TOKEN_EXPIRY}s`,
    });
  }

  validateAndDecodeRefreshToken(encodedToken: string): Token {
    return this.jwtService.verify(encodedToken, {
      secret: this.env.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  validateAndDecodeCsrfToken(encodedToken: string): CsrfToken {
    return this.jwtService.verify(encodedToken, {
      secret: this.env.CSRF_TOKEN_SECRET,
    });
  }

  get authTokenExpiry() {
    return this.env.JWT_EXPIRY;
  }

  get refreshTokenExpiry() {
    return this.env.JWT_REFRESH_EXPIRY;
  }

  get authTokenSecret() {
    return this.env.JWT_SECRET;
  }

  get refreshTokenSecret() {
    return this.env.JWT_REFRESH_TOKEN_SECRET;
  }

  get csrfTokenExpiry() {
    return this.env.CSRF_TOKEN_EXPIRY;
  }

  private signAuthToken(token: Token) {
    return this.jwtService.sign(token, {
      secret: this.env.JWT_SECRET,
      expiresIn: `${this.env.JWT_EXPIRY}s`,
    });
  }

  private signRefreshToken(token: Token) {
    return this.jwtService.sign(token, {
      secret: this.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${this.env.JWT_REFRESH_EXPIRY}s`,
    });
  }

  generateCsrfToken(response: Response): string {
    const secretString = this.token.secretSync();
    const token = this.token.create(secretString);
    const signedSecret = this.signCsrfToken({ sub: secretString });
    this.cookieService.addCsrfCookie(
      response,
      signedSecret,
      this.csrfTokenExpiry,
    );
    return token;
  }

  validCsrfToken(request: Request) {
    try {
      const csrfToken = <string>(
        (request?.headers[TokenService.CSRF_TOKEN_HEADER_NAME] || '')
      );
      const signedSecretFromCookie =
        this.cookieService.extractCsrfCookieFromReq(request);
      if (!csrfToken || !signedSecretFromCookie) return false;
      const { sub: secret } = this.validateAndDecodeCsrfToken(
        signedSecretFromCookie,
      );
      return this.token.verify(secret, csrfToken);
    } catch (err) {
      return false;
    }
  }
}

export interface Token {
  sub: string;
}

export type CsrfToken = Token;
