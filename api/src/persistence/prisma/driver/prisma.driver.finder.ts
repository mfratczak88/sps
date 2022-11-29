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
    const prismaResult = await this.prismaService.user.findFirst({
      where: {
        id,
      },
      ...PrismaDriverFinder.prismaSelect(),
    });
    return PrismaDriverFinder.mapUserToDto(prismaResult);
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
    const parkingLots = user.parkingLots.map((lot) => {
      const { id, city, hourFrom, hourTo, streetName, streetNumber } =
        PrismaParkingLotFinder.prismaLotToDto(lot);
      return {
        id,
        city,
        hourTo,
        hourFrom,
        streetName,
        streetNumber,
      };
    });
    return { ...user, parkingLots };
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
