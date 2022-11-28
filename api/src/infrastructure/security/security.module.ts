import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigurationModule, Environment } from '../../configuration.module';
import {
  JwtRefreshTokenStrategy,
  JwtStrategy,
} from './authorization/jwt.strategy';
import { TokenService } from './token.service';
import { CookieService } from './cookie.service';
import * as Tokens from 'csrf';
import { OAuth2Client } from 'google-auth-library';
import { UserService } from './user/user.service';
import { AuthenticationService } from './authentication/authentication.service';

const providers = [
  JwtRefreshTokenStrategy,
  JwtStrategy,
  {
    provide: TokenService,
    useFactory: async (
      environment: Environment,
      jwtService: JwtService,
      cookieService: CookieService,
    ) => new TokenService(environment, jwtService, cookieService, new Tokens()),
    inject: [Environment, JwtService, CookieService],
  },
  {
    provide: OAuth2Client,
    useFactory: async (env: Environment) =>
      new OAuth2Client({
        clientId: env.GOOGLE_AUTH_ID,
        clientSecret: env.GOOGLE_AUTH_SECRET,
      }),
    inject: [Environment],
  },
  CookieService,
  UserService,
  AuthenticationService,
];
@Module({
  imports: [
    ConfigurationModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (environment: Environment) => {
        return {
          secret: environment.JWT_SECRET,
          signOptions: {
            expiresIn: environment.JWT_EXPIRY,
          },
        };
      },
      inject: [Environment],
    }),
  ],
  providers,
  exports: [CookieService, UserService, AuthenticationService, TokenService],
})
export class SecurityModule {}
