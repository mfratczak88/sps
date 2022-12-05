import { DriverFinder } from '../../../application/driver/driver.finder';
import { DriverReadModel } from '../../../application/driver/driver.read-model';
import { PrismaService } from '../prisma.service';
import { Role } from '../../../infrastructure/security/authorization/role';
import { Injectable } from '@nestjs/common';
import { Id } from '../../../domain/id';
import { DateTime } from 'luxon';

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
    return {
      ...this.mapPrismaRawDataToDto(prismaDriver),
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
    ).map((user) => this.mapPrismaRawDataToDto(user));
  }

  private mapPrismaRawDataToDto(user) {
    const { parkingLots, vehicles, ...rest } = user;
    return {
      ...rest,
      vehicles: vehicles.map(({ licensePlate }) => ({ licensePlate })),
      parkingLotIds: parkingLots.map(({ id }) => id),
      reservationsPendingApprovalIds: vehicles
        .map(({ reservations }) => reservations.map((r) => r.id))
        .flat(),
    };
  }

  private static prismaSelect() {
    const now = DateTime.now();
    const fourHoursFromNow = DateTime.now()
      .set({
        hour: now.hour + 4,
      })
      .toUTC()
      .toJSDate();
    const thirtyMinutesFromNow = DateTime.now()
      .set({
        minute: now.minute + 30,
      })
      .toUTC()
      .toJSDate();
    return {
      select: {
        id: true,
        email: true,
        name: true,
        parkingLots: {
          select: {
            id: true,
          },
        },
        vehicles: {
          select: {
            licensePlate: true,
            reservations: {
              select: {
                id: true,
                startTime: true,
                endTime: true,
                createdAt: true,
                parkingLotId: true,
              },
              where: {
                startTime: {
                  lt: fourHoursFromNow,
                  gt: thirtyMinutesFromNow,
                },
              },
            },
          },
        },
      },
    };
  }
}
