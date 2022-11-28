import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../../../domain/reservation/reservation.repository';
import { Id } from '../../../domain/id';
import { Role } from './role';
import { DriverRepository } from '../../../domain/driver/driver.repository';
import { UserService } from '../user/user.service';

@Injectable()
export class ReservationAuthorizationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly userService: UserService,
    private readonly driverRepository: DriverRepository,
  ) {}

  async canCreateReservation(userId: Id) {
    return this.userHasRole(userId, Role.DRIVER);
  }

  async canConfirmReservation(userId: Id, reservationId: Id) {
    return this.hasUserCreatedReservation(userId, reservationId);
  }

  async canCancelReservation(userId: Id, reservationId: Id) {
    return this.hasUserCreatedReservation(userId, reservationId);
  }

  async canChangeTimeOfReservation(userId: Id, reservationId: Id) {
    return this.hasUserCreatedReservation(userId, reservationId);
  }

  async canIssueParkingTicket(userId: Id) {
    return this.userHasRole(userId, Role.CLERK);
  }
  async canReturnParkingTicket(userId: Id) {
    return this.userHasRole(userId, Role.CLERK);
  }
  private async hasUserCreatedReservation(userId: Id, reservationId: Id) {
    const reservation = await this.reservationRepository.findByIdOrThrow(
      reservationId,
    );
    const { licensePlate } = reservation.plain();
    const driver = await this.driverRepository.findByIdOrThrow(userId);
    return driver.vehicles.some((v) => v.licensePlate === licensePlate);
  }

  private async userHasRole(userId: Id, role: Role) {
    const user = await this.userService.findById(userId);
    return user.role === role;
  }
}
