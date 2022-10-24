import { UnitOfWork } from '../../application/unit-of-work';
import { PrismaService } from './prisma.service';

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prismaService: PrismaService) {}
  beginTransaction(): Promise<void> {
    return Promise.resolve(undefined);
  }

  commit(): Promise<void> {
    return Promise.resolve(undefined);
  }

  rollback(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
