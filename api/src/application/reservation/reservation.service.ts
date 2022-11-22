import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../domain/reservation/reservation.repository';
import { Id, IdGenerator } from '../../domain/id';
import { ParkingLotAvailability } from '../../domain/parking-lot-availability';
import {
  ChangeTimeCommand,
  CreateReservationCommand,
} from './reservation.command';
import { ReservationFactory } from '../../domain/reservation/reservation.factory';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly idGenerator: IdGenerator,
    private readonly parkingLotAvailability: ParkingLotAvailability,
  ) {}

  async makeReservation(command: CreateReservationCommand): Promise<void> {
    const reservation = await new ReservationFactory(
      this.parkingLotAvailability,
      this.idGenerator,
    ).newReservation(command);
    return this.reservationRepository.save(reservation);
  }

  async confirm(reservationId: Id) {
    const reservation = await this.reservationRepository.findByIdOrThrow(
      reservationId,
    );
    reservation.confirm();
    return this.reservationRepository.save(reservation);
  }

  async cancel(reservationId: Id) {
    const reservation = await this.reservationRepository.findByIdOrThrow(
      reservationId,
    );
    reservation.cancel();
    return this.reservationRepository.save(reservation);
  }

  async changeTime(command: ChangeTimeCommand) {
    const { reservationId, start, end } = command;
    const reservation = await this.reservationRepository.findByIdOrThrow(
      reservationId,
    );
    await reservation.changeTime({ start, end }, this.parkingLotAvailability);
    return this.reservationRepository.save(reservation);
  }

  async issueParkingTicket(reservationId: Id) {
    const reservation = await this.reservationRepository.findByIdOrThrow(
      reservationId,
    );
    reservation.issueParkingTicket();
    return this.reservationRepository.save(reservation);
  }

  async returnParkingTicket(reservationId: Id) {
    const reservation = await this.reservationRepository.findByIdOrThrow(
      reservationId,
    );
    reservation.returnParkingTicket();
    return this.reservationRepository.save(reservation);
  }
}
