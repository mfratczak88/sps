import { Global, Module, Provider, Scope } from '@nestjs/common';
import { EmailService } from './email/email.service';

import Mailgun from 'mailgun.js';
import * as FormData from 'form-data';
import { LangService } from './web/lang.service';
import { LanguageService } from '../application/language.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigurationModule, Environment } from '../configuration.module';
import { AuthController } from './web/controller/auth.controller';
import { AuthenticationService } from './security/authentication/authentication.service';
import { UserService } from './security/user/user.service';
import { CookieService } from './security/cookie.service';
import {
  JwtRefreshTokenStrategy,
  JwtStrategy,
} from './security/authorization/jwt.strategy';
import { TokenService } from './security/token.service';
import * as Tokens from 'csrf';
import { OAuth2Client } from 'google-auth-library';

import { ApplicationModule } from '../application/application.module';
import { UsersController } from './web/controller/users.controller';
import { ParkingLotController } from './web/controller/parking-lot.controller';
import { DriverController } from './web/controller/driver.controller';
import { ReservationController } from './web/controller/reservation.controller';
import { ReservationAuthorizationService } from './security/authorization/reservation.authorization.service';

const providers: Provider[] = [
  {
    provide: EmailService,
    useFactory: async (env: Environment) =>
      new EmailService(new Mailgun(FormData), env),
    inject: [Environment],
  },
  {
    provide: LanguageService,
    useClass: LangService,
    scope: Scope.REQUEST,
  },
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
  ReservationAuthorizationService,
];

@Module({
  providers: [...providers],
  controllers: [
    AuthController,
    UsersController,
    ParkingLotController,
    DriverController,
    ReservationController,
  ],
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
    ApplicationModule,
  ],
  exports: providers,
})
@Global()
export class InfrastructureModule {}
