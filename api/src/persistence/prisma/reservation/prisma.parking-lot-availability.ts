import { Injectable } from '@nestjs/common';
import { ParkingLotAvailability } from '../../../domain/parking-lot-availability';
import { Id } from '../../../domain/id';
import { PrismaService } from '../prisma.service';
import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';
import { DateTime, Interval } from 'luxon';
import { ParkingLotRepository } from '../../../domain/parking-lot/parking-lot.repository';
import { ReservationRepository } from '../../../domain/reservation/reservation.repository';

@Injectable()
export class PrismaParkingLotAvailability implements ParkingLotAvailability {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly parkingLotRepository: ParkingLotRepository,
    readonly reservationRepository: ReservationRepository,
  ) {}
  async placeInLotAvailable(
    lotId: Id,
    start: Date,
    end: Date,
  ): Promise<boolean> {
    const parkingLot = await this.parkingLotRepository.findByIdOrElseThrow(
      lotId,
    );
    if (!parkingLot) {
      throw new DomainException({
        message: MessageCode.PARKING_LOT_DOES_NOT_EXIST,
      });
    }
    const { capacity } = parkingLot.plain();

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
      DateTime.fromJSDate(start),
      DateTime.fromJSDate(end),
    );

    return (
      parkingLot.openForParkingAt(start, end) &&
      this.overlappingReservationsCount(
        reservationsInThatDate,
        requestedParkingTimeInterval,
      ) < capacity
    );
  }

  private overlappingReservationsCount(
    reservations,
    requestedParkingTimeInterval,
  ) {
    return reservations
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
  }
}
