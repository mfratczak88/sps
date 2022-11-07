import { CookieService } from '../../security/cookie.service';
import { AuthenticationService } from '../../security/authentication/authentication.service';
import { TokenService } from '../../security/token.service';
import { RequestWithUser } from '../../security/authorization/jwt.strategy';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private readonly cookieService: CookieService,
    private readonly authService: AuthenticationService,
    private readonly tokenService: TokenService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    try {
      const refreshToken =
        this.cookieService.extractRefreshCookieFromReq(request);
      const decodeRefreshToken =
        this.tokenService.validateAndDecodeRefreshToken(refreshToken);
      const { id, role } = await this.authService.getUserIfTokenMatches(
        decodeRefreshToken.sub,
        refreshToken,
      );
      request.user = { id, role };
    } catch (err) {
      console.error(err);
    }
    return next.handle();
  }
}
