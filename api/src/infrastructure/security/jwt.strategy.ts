import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService, AuthToken } from './authentication.service';
import { CookieService } from './cookie.service';
import { TokenService } from './token.service';
import { Request } from 'express';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cookieService: CookieService, authTokenService: TokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieService.extractAuthCookieFromReq,
      ]),
      ignoreExpiration: false,
      secretOrKey: authTokenService.authTokenSecret,
    });
  }

  async validate(payload: AuthToken) {
    return { id: payload.sub };
  }
}

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly cookieService: CookieService,
    private readonly authTokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieService.extractRefreshCookieFromReq,
      ]),
      secretOrKey: authTokenService.refreshTokenSecret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: AuthToken) {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(
      AuthenticationService,
      contextId,
    );
    try {
      const { id } = await authService.getUserIfTokenMatches(
        payload.sub,
        this.cookieService.extractRefreshCookieFromReq(request),
      );
      return (
        id && {
          id: id.toString(),
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export interface RequestWithUser extends Request {
  user?: { id: string };
}
