import { Injectable } from '@nestjs/common';
import { ParkingLotAvailability } from '../../../domain/parking-lot-availability';
import { Id } from '../../../domain/id';
import { PrismaService } from '../prisma.service';
import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';
import { DateTime, Interval } from 'luxon';

@Injectable()
export class PrismaParkingLotAvailability implements ParkingLotAvailability {
  constructor(private readonly prismaService: PrismaService) {}
  async placeInLotAvailable(
    lotId: Id,
    start: string,
    end: string,
  ): Promise<boolean> {
    const parkingLot = await this.prismaService.parkingLot.findUnique({
      where: {
        id: lotId,
      },
    });
    if (!parkingLot) {
      throw new DomainException({
        message: MessageCode.PARKING_LOT_DOES_NOT_EXIST,
      });
    }

    const reservationsInThatDate =
      await this.prismaService.reservation.findMany({
        where: {
          status: {
            not: ReservationStatus.CANCELLED,
          },
          startTime: {
            lte: start,
            gte: end,
          },
        },
      });
    const requestedParkingTimeInterval = Interval.fromDateTimes(
      DateTime.fromSQL(start),
      DateTime.fromSQL(end),
    );
    const overlappingReservationsCount = reservationsInThatDate
      .map(({ startTime, endTime }) => {
        const existingReservationInterval = Interval.fromDateTimes(
          DateTime.fromJSDate(startTime),
          DateTime.fromJSDate(endTime),
        );
        return existingReservationInterval.overlaps(
          requestedParkingTimeInterval,
        );
      })
      .filter((x) => !!x).length;
    return overlappingReservationsCount < parkingLot.capacity;
  }
}
