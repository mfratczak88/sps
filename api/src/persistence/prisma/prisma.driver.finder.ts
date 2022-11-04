import { DriverFinder } from '../../application/driver/driver.finder';
import { DriverReadModel } from '../../application/driver/driver.read-model';
import { PrismaService } from './prisma.service';
import { Role } from '../../infrastructure/security/authorization/role';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDriverFinder implements DriverFinder {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(): Promise<DriverReadModel[]> {
    return this.prismaService.user.findMany({
      where: {
        role: Role.DRIVER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        parkingLots: true,
      },
    });
  }
}
