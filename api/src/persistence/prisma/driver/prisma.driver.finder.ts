import { DriverFinder } from '../../../application/driver/driver.finder';
import { DriverReadModel } from '../../../application/driver/driver.read-model';
import { PrismaService } from '../prisma.service';
import { Role } from '../../../infrastructure/security/authorization/role';
import { Injectable } from '@nestjs/common';
import { PrismaParkingLotFinder } from '../parking-lot/prisma.parking-lot.finder';
import { Id } from '../../../domain/id';

@Injectable()
export class PrismaDriverFinder implements DriverFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: Id): Promise<DriverReadModel> {
    const prismaDriver = await this.prismaService.user.findFirst({
      where: {
        id,
      },
      ...PrismaDriverFinder.prismaSelect(),
    });
    const unAssignedLots = await this.prismaService.parkingLot.findMany({
      where: {
        users: {
          none: {
            id,
          },
        },
      },
    });
    return {
      ...PrismaDriverFinder.mapUserToDto(prismaDriver),
      unAssignedLots: unAssignedLots.map((lot) =>
        PrismaDriverFinder.lotToDto(lot),
      ),
    };
  }

  async findAll(): Promise<DriverReadModel[]> {
    return (
      await this.prismaService.user.findMany({
        where: {
          role: Role.DRIVER,
        },
        ...PrismaDriverFinder.prismaSelect(),
      })
    ).map((user) => PrismaDriverFinder.mapUserToDto(user));
  }

  private static mapUserToDto(user) {
    return {
      ...user,
      parkingLots: user.parkingLots.map((lot) =>
        PrismaDriverFinder.lotToDto(lot),
      ),
    };
  }

  private static lotToDto(lot) {
    const { id, city, hourFrom, hourTo, streetName, streetNumber, days } =
      PrismaParkingLotFinder.prismaLotToDto(lot);
    return {
      id,
      city,
      hourTo,
      hourFrom,
      streetName,
      streetNumber,
      days,
    };
  }

  private static prismaSelect() {
    return {
      select: {
        id: true,
        email: true,
        name: true,
        parkingLots: true,
        vehicles: {
          select: {
            licensePlate: true,
          },
        },
      },
    };
  }
}
