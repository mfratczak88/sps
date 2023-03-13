import { Global, Module, Provider, Scope } from '@nestjs/common';
import { EmailService } from './email/email.service';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as Tokens from 'csrf';
import * as FormData from 'form-data';
import { OAuth2Client } from 'google-auth-library';
import Mailgun from 'mailgun.js';
import { LanguageService } from '../application/language.service';
import { ConfigurationModule, Environment } from '../configuration.module';
import { AuthenticationService } from './security/authentication/authentication.service';
import {
  JwtRefreshTokenStrategy,
  JwtStrategy,
} from './security/authorization/jwt.strategy';
import { CookieService } from './security/cookie.service';
import { TokenService } from './security/token.service';
import { UserService } from './security/user/user.service';
import { AuthController } from './web/controller/auth.controller';
import { LangService } from './web/lang.service';

import { ApplicationModule } from '../application/application.module';
import { ReservationAuthorizationService } from './security/authorization/reservation.authorization.service';
import { DriverController } from './web/controller/driver.controller';
import { ParkingLotController } from './web/controller/parking-lot.controller';
import { ReservationController } from './web/controller/reservation.controller';
import { UsersController } from './web/controller/users.controller';
import { VehiclesController } from './web/controller/vehicles.controller';

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
    VehiclesController,
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
