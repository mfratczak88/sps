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

    return (
      PrismaParkingLotAvailability.withinHours(
        parkingLot,
        requestedParkingTimeInterval,
      ) &&
      this.overlappingReservationsCount(
        reservationsInThatDate,
        requestedParkingTimeInterval,
      ) < parkingLot.capacity
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
  // maybe repeating interval instead of plain hours - lot can be op
  private static withinHours(parkingLot, requestedParkingTimeInterval) {
    const { hourFrom, hourTo } = parkingLot;
    const lotHourFrom =
      PrismaParkingLotAvailability.onlyTimeFromSqlDateTime(hourFrom);
    const lotHourTo =
      PrismaParkingLotAvailability.onlyTimeFromSqlDateTime(hourTo);
    const parkingHourFrom =
      PrismaParkingLotAvailability.onlyTimeFromSqlDateTime(
        requestedParkingTimeInterval.start,
      );
    const parkingHourTo = PrismaParkingLotAvailability.onlyTimeFromSqlDateTime(
      requestedParkingTimeInterval.end,
    );
    return parkingHourFrom >= lotHourFrom && parkingHourTo <= lotHourTo;
  }

  private static onlyTimeFromSqlDateTime(dateTime: DateTime) {
    return DateTime.fromSQL(
      dateTime.toSQLTime({
        includeOffset: false,
      }),
    );
  }
}
