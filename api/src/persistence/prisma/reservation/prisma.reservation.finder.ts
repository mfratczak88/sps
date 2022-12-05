import { Injectable } from '@nestjs/common';
import {
  ReservationFinder,
  ReservationQuery,
} from '../../../application/reservation/reservation.finder';
import { PrismaService } from '../prisma.service';
import { ReservationReadModel } from '../../../application/reservation/reservation.read-model';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';

@Injectable()
export class PrismaReservationFinder implements ReservationFinder {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: ReservationQuery): Promise<ReservationReadModel[]> {
    const reservations = await this.prismaService.reservation.findMany({
      select: {
        id: true,
        parkingLotId: true,
        status: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        licensePlate: true,
        parkingTickets: {
          select: {
            timeOfLeave: true,
            timeOfEntry: true,
            validTo: true,
          },
        },
      },
      where: this.whereClauseFrom(query),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return reservations.map((reservation) => {
      const { status, ...rest } = reservation;
      return {
        ...rest,
        status: status as ReservationStatus,
      };
    });
  }

  whereClauseFrom(query: ReservationQuery) {
    const { driverId } = query;
    return (
      driverId && {
        vehicle: {
          user: {
            id: driverId,
          },
        },
      }
    );
  }
}
