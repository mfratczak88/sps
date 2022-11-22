import { DriverFinder } from '../../../application/driver/driver.finder';
import { DriverReadModel } from '../../../application/driver/driver.read-model';
import { PrismaService } from '../prisma.service';
import { Role } from '../../../infrastructure/security/authorization/role';
import { Injectable } from '@nestjs/common';
import { PrismaParkingLotFinder } from '../parking-lot/prisma.parking-lot.finder';

@Injectable()
export class PrismaDriverFinder implements DriverFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<DriverReadModel[]> {
    return (
      await this.prismaService.user.findMany({
        where: {
          role: Role.DRIVER,
        },
        select: {
          id: true,
          email: true,
          name: true,
          parkingLots: true,
        },
      })
    ).map((user) => {
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
    });
  }
}
