import { Injectable } from '@nestjs/common';
import { ReservationFinder } from '../../../application/reservation/reservation.finder';
import { PrismaService } from '../prisma.service';
import {
  ReservationQuery,
  ReservationReadModel,
  ReservationsReadModel,
  SortBy,
  SortOrder,
} from '../../../application/reservation/reservation.read-model';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';
import { DateTime } from 'luxon';
import { Id } from '../../../domain/id';

@Injectable()
export class PrismaReservationFinder implements ReservationFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: ReservationQuery): Promise<ReservationsReadModel> {
    let { page, pageSize } = query;
    page = page || 1;
    pageSize = pageSize || 5;
    const reservations = await this.prismaService.reservation.findMany({
      select: {
        ...PrismaReservationFinder.selectClause,
      },
      where: this.whereClauseFrom(query),
      orderBy: this.orderByClauseFrom(query),
      take: pageSize,
      skip: page > 1 ? pageSize * (page - 1) : 0,
    });
    // fixme - distill two queries into one
    const count = await this.prismaService.reservation.count({
      where: this.whereClauseFrom(query),
    });
    return {
      count,
      page,
      pageSize,
      data: reservations.map((reservation) =>
        PrismaReservationFinder.mapReservationToDto(
          reservation as PrismaReservation,
        ),
      ),
    };
  }

  async findById(id: Id): Promise<ReservationReadModel> {
    const prismaReservation = (await this.prismaService.reservation.findUnique({
      select: {
        ...PrismaReservationFinder.selectClause,
      },
      where: {
        id,
      },
    })) as PrismaReservation;
    return PrismaReservationFinder.mapReservationToDto(prismaReservation);
  }

  static mapReservationToDto(
    prismaReservation: PrismaReservation,
  ): ReservationReadModel {
    const { status, parkingLot, startTime, ...rest } = prismaReservation;
    // fixme: put those values into env vars
    const approvalTimeStart =
      status === ReservationStatus.DRAFT &&
      DateTime.fromJSDate(startTime)
        .minus({
          hour: 4,
        })
        .toJSDate();
    const approvalDeadLine =
      approvalTimeStart &&
      DateTime.fromJSDate(startTime)
        .minus({
          minute: 30,
        })
        .toJSDate();
    return {
      ...rest,
      ...parkingLot,
      startTime,
      date: startTime,
      approvalTimeStart,
      approvalDeadLine,
      status,
    };
  }

  whereClauseFrom({
    driverId,
    parkingLotId,
    status,
    onlyHistory,
    licensePlate,
    startTime,
  }: ReservationQuery) {
    const whereOnlyHistory = onlyHistory
      ? {
          OR: [
            {
              endTime: {
                lt: DateTime.now().toJSDate(),
              },
            },
            {
              status: ReservationStatus.CANCELLED,
            },
          ],
        }
      : {};
    const whereDriver = driverId
      ? {
          vehicle: {
            user: {
              id: driverId,
            },
          },
        }
      : {};
    const whereParkingLot = parkingLotId ? { parkingLotId } : {};
    const whereStatus = status ? { status } : {};
    const whereLicensePlate = licensePlate
      ? {
          vehicle: {
            licensePlate,
          },
        }
      : {};
    const whereStartTime = startTime
      ? {
          AND: [
            { startTime: { gt: startTime } },
            {
              endTime: {
                lt: DateTime.fromJSDate(startTime).set({ hour: 23 }).toJSDate(),
              },
            },
          ],
        }
      : {};
    return {
      ...whereDriver,
      ...whereParkingLot,
      ...whereStatus,
      ...whereOnlyHistory,
      ...whereLicensePlate,
      ...whereStartTime,
    };
  }

  orderByClauseFrom({ sortOrder, sortBy }: ReservationQuery) {
    const byParkingLotId = sortBy === SortBy.PARKING_LOT && {
      parkingLotId: sortOrder,
    };
    const byDate = sortBy === SortBy.DATE && {
      startTime: sortOrder,
    };
    const byStatus = sortBy === SortBy.STATUS && {
      status: sortOrder,
    };
    return (
      byParkingLotId ||
      byDate ||
      byStatus || { startTime: SortOrder.DESCENDING }
    );
  }

  static selectClause = {
    id: true,
    parkingLotId: true,
    status: true,
    startTime: true,
    endTime: true,
    createdAt: true,
    licensePlate: true,
    parkingLot: {
      select: {
        city: true,
        streetName: true,
        streetNumber: true,
      },
    },
    parkingTickets: {
      select: {
        timeOfLeave: true,
        timeOfEntry: true,
        validTo: true,
      },
    },
  };
}

export type PrismaReservation = {
  status: ReservationStatus;
  parkingLotId: string;
  parkingLot: { city: string; streetName: string; streetNumber: string };
  createdAt: Date;
  licensePlate: string;
  id: string;
  startTime: Date;
  endTime: Date;
  parkingTickets: {
    timeOfEntry: Date;
    timeOfLeave: Date;
    validTo: Date;
  }[];
};
