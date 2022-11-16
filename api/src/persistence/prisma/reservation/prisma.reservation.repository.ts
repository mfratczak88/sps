import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../../domain/reservation/reservation.repository';
import { PrismaService } from '../prisma.service';
import { Reservation } from '../../../domain/reservation/reservation';
import { Id, IdGenerator } from '../../../domain/id';
import { ReservationStatus } from '../../../domain/reservation/reservation-status';

import { DomainException } from '../../../domain/domain.exception';
import { MessageCode } from '../../../message';
import { jsDateToString, stringToJsDate } from '../time/prisma.moment';

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
          timeOfEntry: jsDateToString(timeOfEntry),
          timeOfLeave: timeOfLeave && jsDateToString(timeOfLeave),
          validTo: jsDateToString(validTo),
        }),
      ),
      scheduledParkingTime: {
        start: jsDateToString(startTime),
        end: jsDateToString(endTime),
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
    const parkingTicketsToSet = await Promise.all(
      parkingTickets.map(async (ticket) => {
        const existing = existingTickets.find(
          (existing) =>
            jsDateToString(existing.timeOfEntry) === ticket.timeOfEntry &&
            jsDateToString(existing.validTo) === ticket.validTo,
        );
        if (existing) {
          existing.validTo = stringToJsDate(ticket.validTo);
          return existing;
        }
        return {
          id: await this.idGenerator.generate(),
          reservationId,
          timeOfEntry: stringToJsDate(ticket.timeOfEntry),
          validTo: stringToJsDate(ticket.validTo),
          timeOfLeave: ticket.timeOfLeave && stringToJsDate(ticket.timeOfLeave),
        };
      }),
    );
    const prismaFields = {
      status: status,
      parkingLotId,
      startTime: stringToJsDate(start.toString()),
      endTime: stringToJsDate(end.toString()),
      licensePlate,
      parkingTickets: {
        set: parkingTicketsToSet,
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
        parkingTickets: {
          createMany: {
            data: parkingTicketsToSet,
          },
        },
      },
    });
  }
}
