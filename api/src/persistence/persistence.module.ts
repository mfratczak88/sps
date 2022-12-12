import { Global, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaIdGenerator } from './prisma/prisma.id.generator';
import { IdGenerator } from '../domain/id';

import {
  RegistrationTokenStore,
  UserStore,
} from '../infrastructure/security/user/user.store';
import { PrismaUserStore } from './prisma/user/prisma.user.store';
import { PrismaRegistrationTokenStore } from './prisma/user/prisma.registration-token.store';

import { DriverRepository } from '../domain/driver/driver.repository';
import { PrismaDriverRepository } from './prisma/driver/prisma.driver.repository';
import { ParkingLotRepository } from '../domain/parking-lot/parking-lot.repository';
import { PrismaParkingLotRepository } from './prisma/parking-lot/prisma.parking-lot.repository';
import { ParkingLotFinder } from '../application/parking-lot/parking-lot.finder';
import { DriverFinder } from '../application/driver/driver.finder';
import { PrismaDriverFinder } from './prisma/driver/prisma.driver.finder';
import { ReservationRepository } from '../domain/reservation/reservation.repository';
import { PrismaReservationRepository } from './prisma/reservation/prisma.reservation.repository';
import { ParkingLotAvailability } from '../domain/parking-lot-availability';
import { PrismaParkingLotAvailability } from './prisma/reservation/prisma.parking-lot-availability';
import { PrismaParkingLotFinder } from './prisma/parking-lot/prisma.parking-lot.finder';
import { ReservationFinder } from '../application/reservation/reservation.finder';
import { PrismaReservationFinder } from './prisma/reservation/prisma.reservation.finder';

const providers: Provider[] = [
  {
    provide: IdGenerator,
    useClass: PrismaIdGenerator,
  },
  PrismaService,
  {
    provide: UserStore,
    useClass: PrismaUserStore,
  },
  {
    provide: RegistrationTokenStore,
    useClass: PrismaRegistrationTokenStore,
  },
  {
    provide: DriverRepository,
    useClass: PrismaDriverRepository,
  },
  {
    provide: ParkingLotRepository,
    useClass: PrismaParkingLotRepository,
  },
  {
    provide: ParkingLotFinder,
    useClass: PrismaParkingLotFinder,
  },
  {
    provide: DriverFinder,
    useClass: PrismaDriverFinder,
  },
  {
    provide: ReservationRepository,
    useClass: PrismaReservationRepository,
  },

  {
    provide: ParkingLotAvailability,
    useClass: PrismaParkingLotAvailability,
  },
  {
    provide: ReservationFinder,
    useClass: PrismaReservationFinder,
  },
];

@Module({
  providers: providers,
  exports: providers,
})
@Global()
export class PersistenceModule {}
