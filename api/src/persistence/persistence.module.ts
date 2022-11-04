import { Global, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaIdGenerator } from './prisma/prisma.id.generator';
import { IdGenerator } from '../domain/id';

import {
  RegistrationTokenStore,
  UserStore,
} from '../infrastructure/security/user/user.store';
import { PrismaUserStore } from './prisma/prisma.user.store';
import { PrismaRegistrationTokenStore } from './prisma/prisma.registration-token.store';

import { DriverRepository } from '../domain/driver.repository';
import { PrismaDriverRepository } from './prisma/prisma.driver.repository';
import { ParkingLotRepository } from '../domain/parking-lot.repository';
import { PrismaParkingLotRepository } from './prisma/prisma.parking-lot.repository';
import { ParkingLotFinder } from '../application/parking-lot/parking-lot.finder';
import { PrismaParkingLotFinder } from './prisma/prisma.parking-lot.finder';
import { DriverFinder } from '../application/driver/driver.finder';
import { PrismaDriverFinder } from './prisma/prisma.driver.finder';

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
];

@Module({
  providers: providers,
  exports: providers,
})
@Global()
export class PersistenceModule {}
