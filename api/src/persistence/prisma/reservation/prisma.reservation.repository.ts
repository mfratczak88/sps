import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../../domain/reservation/reservation.repository';
import { PrismaService } from '../prisma.service';
import { Reservation } from '../../../domain/reservation/reservation';
import { Id, IdGenerator } from '../../../domain/id';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';
import { DateTime } from 'luxon';
import { fromSqlTime, toSqlTime } from '../../../domain/period-of-time';
import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';

@Injectable()
export class PrismaReservationRepository implements ReservationRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly idGenerator: IdGenerator,
  ) {}

  async findByIdOrThrow(reservationId: Id): Promise<Reservation> {
    const reservationRaw = await this.prismaService.reservation.findUnique({
      where: {
        id: reservationId,
      },
      include: {
        parkingTickets: true,
      },
    });
    if (!reservationRaw) {
      throw new DomainException({
        message: MessageCode.RESERVATION_DOES_NOT_EXIST,
      });
    }
    const {
      id,
      parkingLotId,
      licensePlate,
      endTime,
      startTime,
      status,
      parkingTickets,
    } = reservationRaw;
    return new Reservation({
      id,
      parkingLotId,
      licensePlate,
      status: status as ReservationStatus,
      parkingTickets: parkingTickets.map(
        ({ timeOfEntry, timeOfLeave, validTo }) => ({
          timeOfEntry: this.jsDateToSqlString(timeOfEntry),
          timeOfLeave: this.jsDateToSqlString(timeOfLeave),
          validTo: validTo && this.jsDateToSqlString(validTo),
        }),
      ),
      scheduledParkingTime: {
        start: this.jsDateToSqlString(startTime),
        end: this.jsDateToSqlString(endTime),
      },
    });
  }

  async save(reservation: Reservation): Promise<void> {
    const {
      id: reservationId,
      parkingTickets,
      status,
      scheduledParkingTime: { start, end },
      parkingLotId,
      licensePlate,
    } = reservation.toPlain();
    const existingTickets = await this.prismaService.parkingTicket.findMany({
      where: {
        reservationId,
      },
    });
    const ticketsToBeSet = await Promise.all(
      parkingTickets.map(async (t) => {
        const existing = existingTickets.find(
          (e) =>
            this.jsDateToSqlString(e.timeOfLeave) === t.timeOfLeave &&
            this.jsDateToSqlString(e.validTo) === t.validTo,
        );
        if (existing) {
          existing.validTo = this.sqlStringToJsDate(t.validTo);
          return existing;
        }
        return {
          id: await this.idGenerator.generate(),
          reservationId,
          timeOfEntry: this.sqlStringToJsDate(t.timeOfEntry),
          validTo: this.sqlStringToJsDate(t.validTo),
          timeOfLeave: t.timeOfLeave && this.sqlStringToJsDate(t.timeOfLeave),
        };
      }),
    );
    const prismaFields = {
      status: status,
      parkingLotId,
      startTime: this.sqlStringToJsDate(start),
      endTime: this.sqlStringToJsDate(end),
      licensePlate,
      parkingTickets: {
        set: ticketsToBeSet,
      },
    };
    await this.prismaService.reservation.upsert({
      where: {
        id: reservationId,
      },
      update: prismaFields,
      create: {
        id: reservationId,
        ...prismaFields,
      },
    });
  }

  jsDateToSqlString(date: Date) {
    return toSqlTime(DateTime.fromJSDate(date));
  }

  sqlStringToJsDate(date: string) {
    return fromSqlTime(date).toJSDate();
  }
}
