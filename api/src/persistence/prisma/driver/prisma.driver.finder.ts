import { DriverFinder } from '../../../application/driver/driver.finder';
import {
  DriverQuery,
  DriverReadModel,
  TimeHorizon,
} from '../../../application/driver/driver.read-model';
import { PrismaService } from '../prisma.service';
import { Role } from '../../../infrastructure/security/authorization/role';
import { Injectable } from '@nestjs/common';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';
import { Id } from '../../../domain/id';
import { DateTime } from 'luxon';
import {
  PrismaReservation,
  PrismaReservationFinder,
} from '../reservation/prisma.reservation.finder';
import { Vehicle } from 'src/domain/driver/vehicle';

@Injectable()
export class PrismaDriverFinder implements DriverFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findSingle(driverId: Id, query: DriverQuery): Promise<DriverReadModel> {
    const { timeHorizon } = query;
    const prismaDriver = await this.prismaService.user.findFirst({
      where: {
        id: driverId,
        role: Role.DRIVER,
      },
      ...this.driverSelect,
    });
    const driverDto =
      PrismaDriverFinder.mapPrismaDriverToReadModel(prismaDriver);

    const withTimeHorizon = {
      pendingAction: timeHorizon?.includes(TimeHorizon.PENDING_ACTION)
        ? await this.loadPendingActionReservations(driverId)
        : [],
      ongoing: timeHorizon?.includes(TimeHorizon.ONGOING)
        ? await this.loadOngoingReservations(driverId)
        : [],
      dueNext: timeHorizon?.includes(TimeHorizon.DUE_NEXT)
        ? await this.loadDueNextReservations(driverId)
        : [],
    };
    return {
      ...driverDto,
      timeHorizon: {
        ...withTimeHorizon,
      },
    };
  }

  private async loadDueNextReservations(driverId: Id) {
    const now = DateTime.now().toJSDate();
    const reservations = await (this.prismaService.reservation.findMany({
      select: {
        ...PrismaReservationFinder.selectClause,
      },
      where: {
        startTime: {
          gt: now,
        },
        status: {
          not: ReservationStatus.CANCELLED,
        },
        vehicle: {
          user: {
            id: driverId,
          },
        },
      },
    }) as Promise<PrismaReservation[]>);
    return reservations.map((r) =>
      PrismaReservationFinder.mapReservationToDto(r),
    );
  }
  private async loadPendingActionReservations(driverId: Id) {
    const now = DateTime.now();
    const fourHoursFromNow = now.plus({ hour: 4 }).toJSDate();
    const thirtyMinutesFromNow = now.plus({ minute: 30 }).toJSDate();
    const reservations = await (this.prismaService.reservation.findMany({
      select: {
        ...PrismaReservationFinder.selectClause,
      },
      where: {
        startTime: {
          lt: fourHoursFromNow,
          gt: thirtyMinutesFromNow,
        },
        status: ReservationStatus.DRAFT,
        vehicle: {
          user: {
            id: driverId,
          },
        },
      },
    }) as Promise<PrismaReservation[]>);
    return reservations.map((r) =>
      PrismaReservationFinder.mapReservationToDto(r),
    );
  }
  private async loadOngoingReservations(driverId: Id) {
    const now = DateTime.now().toJSDate();
    const reservations = await (this.prismaService.reservation.findMany({
      select: {
        ...PrismaReservationFinder.selectClause,
      },
      where: {
        startTime: {
          lt: now,
        },
        endTime: {
          gt: now,
        },
        status: ReservationStatus.CONFIRMED,
        vehicle: {
          user: {
            id: driverId,
          },
        },
      },
    }) as Promise<PrismaReservation[]>);
    return reservations.map((r) =>
      PrismaReservationFinder.mapReservationToDto(r),
    );
  }
  async findAll(): Promise<DriverReadModel[]> {
    return (
      await this.prismaService.user.findMany({
        where: {
          role: Role.DRIVER,
        },
        ...this.driverSelect,
      })
    ).map((user: PrismaDriver) =>
      PrismaDriverFinder.mapPrismaDriverToReadModel(user),
    );
  }

  findAllVehicles(): Promise<Vehicle[]> {
    return this.prismaService.vehicle.findMany({});
  }

  private static mapPrismaDriverToReadModel(user: PrismaDriver) {
    const { parkingLots, vehicles, ...rest } = user;
    return {
      ...rest,
      vehicles: vehicles.map(({ licensePlate }) => ({ licensePlate })),
      parkingLotIds: parkingLots.map(({ id }) => id),
    };
  }
  readonly reservationSelect = {
    select: {
      id: true,
      vehicle: {
        select: {
          licensePlate: true,
        },
      },
      startTime: true,
      endTime: true,
      createdAt: true,
      status: true,
      parkingTickets: true,
      parkingLot: {
        select: {
          id: true,
          city: true,
          streetNumber: true,
          streetName: true,
        },
      },
    },
  };
  readonly driverSelect = {
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
        },
      },
    },
  };
}
interface PrismaDriver {
  id: string;
  email: string;
  name: string;
  parkingLots: { id: string }[];
  vehicles: { licensePlate: string }[];
}
