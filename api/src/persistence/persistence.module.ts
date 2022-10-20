import { Global, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaIdGenerator } from './prisma/prisma.id.generator';
import { IdGenerator } from '../application/id.generator';

import {
  RegistrationTokenStore,
  UserStore,
} from '../infrastructure/security/user.store';
import { PrismaUserStore } from './prisma/prisma.user.store';
import { PrismaRegistrationTokenStore } from './prisma/prisma.registration-token.store';
import { UnitOfWork } from '../application/unit-of-work';
import { PrismaUnitOfWork } from './prisma/prisma.unit-of-work';

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
    provide: UnitOfWork,
    useClass: PrismaUnitOfWork,
  },
];

@Module({
  providers: providers,
  exports: providers,
})
@Global()
export class PersistenceModule {}
