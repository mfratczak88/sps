import { DriverFinder } from '../../../application/driver/driver.finder';
import {
  DriverReadModel,
  DriverReservationReadModel,
  DriverReservations,
} from '../../../application/driver/driver.read-model';
import { PrismaService } from '../prisma.service';
import { Role } from '../../../infrastructure/security/authorization/role';
import { Injectable } from '@nestjs/common';
import { Id } from '../../../domain/id';
import { DateTime } from 'luxon';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';

@Injectable()
export class PrismaDriverFinder implements DriverFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: Id): Promise<DriverReadModel> {
    const prismaDriver: PrismaDriver = await this.prismaService.user.findFirst({
      where: {
        id,
      },
      ...this.driverSelect,
    });
    return {
      ...PrismaDriverFinder.mapPrismaDriverToReadModel(prismaDriver),
    };
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

  async findDriverReservations(driverId: Id): Promise<DriverReservations> {
    const vehicleWhereClause = {
      vehicle: {
        user: {
          id: driverId,
        },
      },
    };
    const now = DateTime.now();
    const fourHoursFromNow = now
      .set({
        hour: now.hour + 4,
      })
      .toUTC()
      .toJSDate();
    const thirtyMinutesFromNow = now
      .set({
        minute: now.minute + 30,
      })
      .toUTC()
      .toJSDate();
    const pendingAction = await (this.prismaService.reservation.findMany({
      where: {
        startTime: {
          lt: fourHoursFromNow,
          gt: thirtyMinutesFromNow,
        },
        status: ReservationStatus.DRAFT,
        ...vehicleWhereClause,
      },
      ...this.reservationSelect,
    }) as Promise<PrismaReservation[]>);
    const dueNext = await (this.prismaService.reservation.findMany({
      where: {
        status: ReservationStatus.CONFIRMED,
        startTime: {
          gt: now.toJSDate(),
        },
        ...vehicleWhereClause,
      },
      ...this.reservationSelect,
    }) as Promise<PrismaReservation[]>);
    const alreadyFetchedReservationIds = [
      ...dueNext.map(({ id }) => id),
      ...pendingAction.map(({ id }) => id),
    ];
    const history: PrismaReservation[] =
      await (this.prismaService.reservation.findMany({
        where: {
          ...vehicleWhereClause,
          id: {
            not: {
              in: alreadyFetchedReservationIds,
            },
          },
        },
        ...this.reservationSelect,
      }) as Promise<PrismaReservation[]>);
    return {
      history: history.map((reservation) =>
        PrismaDriverFinder.mapPrismaReservationToReadModel(reservation),
      ),
      dueNext: dueNext.map((r) =>
        PrismaDriverFinder.mapPrismaReservationToReadModel(r),
      ),
      pendingAction: pendingAction.map((r) =>
        PrismaDriverFinder.mapPrismaReservationToReadModel(r),
      ),
    };
  }

  private static mapPrismaReservationToReadModel(
    prismaReservation: PrismaReservation,
  ): DriverReservationReadModel {
    const {
      vehicle: { licensePlate },
      parkingLot: { id, city, streetName, streetNumber },
      ...reservation
    } = prismaReservation;
    return {
      ...reservation,
      licensePlate,
      parkingLotId: id,
      parkingLot: {
        city,
        streetName,
        streetNumber,
      },
    };
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
interface PrismaReservation {
  id: string;
  vehicle: { licensePlate: string };
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  status: ReservationStatus;
  parkingTickets: {
    timeOfEntry: Date;
    timeOfLeave: Date;
    validTo: Date;
  }[];
  parkingLot: {
    id: string;
    city: string;
    streetName: string;
    streetNumber: string;
  };
}
