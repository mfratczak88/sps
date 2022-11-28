import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../../domain/reservation/reservation.repository';
import { UserStore } from '../user/user.store';
import { Id } from '../../../domain/id';
import { Role } from './role';
import { DriverRepository } from '../../../domain/driver/driver.repository';

@Injectable()
export class ReservationAuthorizationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly userStore: UserStore,
    private readonly driverRepository: DriverRepository,
  ) {}

  async canCreateReservation(userId: Id) {
    return this.userHasRole(userId, Role.DRIVER);
  }

  async canConfirmReservation(userId: Id, reservationId: Id) {
    return this.userCreatedReservation(userId, reservationId);
  }

  async canCancelReservation(userId: Id, reservationId: Id) {
    return this.userCreatedReservation(userId, reservationId);
  }

  async canChangeTimeOfReservation(userId: Id, reservationId: Id) {
    return this.userCreatedReservation(userId, reservationId);
  }

  async canIssueParkingTicket(userId: Id) {
    return this.userHasRole(userId, Role.CLERK);
  }
  async canReturnParkingTicket(userId: Id) {
    return this.userHasRole(userId, Role.CLERK);
  }
  private async userCreatedReservation(userId: Id, reservationId: Id) {
    const reservation = await this.reservationRepository.findByIdOrThrow(
      reservationId,
    );
    const { licensePlate: plateFromReservation } = reservation.plain();
    const driver = await this.driverRepository.findByIdOrThrow(userId);
    return driver.vehicles.some((v) => v.licensePlate === plateFromReservation);
  }

  private async userHasRole(userId: Id, role: Role) {
    const user = await this.userStore.findById(userId);
    return user.role === role;
  }
}
