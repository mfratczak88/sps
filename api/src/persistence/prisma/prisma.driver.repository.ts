import { DriverRepository } from '../../domain/driver.repository';
import { Driver } from '../../domain/driver';
import { PrismaService } from './prisma.service';
import { DomainException } from '../../domain/domain.exception';
import { MessageCode } from '../../message';
import { Id } from '../../domain/id';
import { Vehicle } from '../../domain/vehicle';

export class PrismaDriverRepository implements DriverRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByIdOrThrow(id: Id): Promise<Driver> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        parkingLots: true,
        vehicles: true,
      },
    });
    if (!user) {
      throw new DomainException({
        message: MessageCode.DRIVER_DOES_NOT_EXIST,
      });
    }
    return new Driver(
      user.id,
      user.vehicles.map((v) => new Vehicle(v.licensePlate)),
      user.parkingLots.map((lot) => lot.id),
    );
  }

  async save(driver: Driver): Promise<void> {
    const parkingLots = driver.assignedParkingLots.map((id) => ({
      id,
    }));
    const existingParkingLots = await this.prismaService.parkingLot.findMany({
      where: {
        id: { in: parkingLots.map((x) => x.id) },
      },
    });

    if (existingParkingLots.length !== parkingLots.length) {
      for (const lot of parkingLots) {
        if (!existingParkingLots.find((l) => l.id === lot.id)) {
          throw new DomainException({
            message: MessageCode.PARKING_LOT_DOES_NOT_EXIST,
            args: { lotId: lot.id },
          });
        }
      }
    }
    const licensePlates = driver.vehicles.map(({ licensePlate }) => ({
      create: { licensePlate },
      where: { licensePlate },
    }));
    await this.prismaService.user.update({
      where: {
        id: driver.id,
      },
      data: {
        parkingLots: {
          connect: parkingLots,
        },
        vehicles: {
          connectOrCreate: [...licensePlates],
        },
      },
    });
  }
}
