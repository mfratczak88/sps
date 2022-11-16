import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../domain/reservation/reservation.repository';
import { IdGenerator } from '../../domain/id';
import { ParkingLotAvailability } from '../../domain/parking-lot-availability';
import { CreateReservationCommand } from './reservation.command';
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
    await this.reservationRepository.save(reservation);
  }
}
