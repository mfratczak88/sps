import { Module, Scope } from '@nestjs/common';
import { LanguageService } from '../../application/language.service';
import { LangService } from './lang.service';
import { AuthController } from './auth.controller';
import { UsersController } from './users.controller';
import { ParkingLotController } from './parking-lot.controller';
import { DriverController } from './driver.controller';
import { ReservationController } from './reservation.controller';
import { SecurityModule } from '../security/security.module';
import { ApplicationModule } from '../../application/application.module';

@Module({
  providers: [
    {
      provide: LanguageService,
      useClass: LangService,
      scope: Scope.REQUEST,
    },
  ],
  controllers: [
    AuthController,
    UsersController,
    ParkingLotController,
    DriverController,
    ReservationController,
  ],
  imports: [SecurityModule, ApplicationModule],
})
export class WebModule {}
