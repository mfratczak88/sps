import { PolicyCheckContext, PolicyHandler } from './policy.handler';
import { ModuleRef } from '@nestjs/core';
import { ReservationAuthorizationService } from '../reservation.authorization.service';
import { ChangeTimeCommand } from '../../../../application/reservation/reservation.command';

export class CanCreateReservation implements PolicyHandler {
  handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef } = context;
    return reservationAuthServiceFromModuleRef(moduleRef).canCreateReservation(
      userId,
    );
  }
}
export class CanChangeTimeOfReservation implements PolicyHandler {
  handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, command, moduleRef } = context;
    const { reservationId } = <ChangeTimeCommand>command;
    return reservationAuthServiceFromModuleRef(
      moduleRef,
    ).canChangeTimeOfReservation(userId, reservationId);
  }
}
export class CanConfirmReservation implements PolicyHandler {
  handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef, params } = context;
    const reservationId = params['id'];
    return (
      reservationId &&
      reservationAuthServiceFromModuleRef(moduleRef).canConfirmReservation(
        userId,
        reservationId,
      )
    );
  }
}
export class CanCancelReservation implements PolicyHandler {
  handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef, params } = context;
    const reservationId = params['id'];
    return (
      reservationId &&
      reservationAuthServiceFromModuleRef(moduleRef).canCancelReservation(
        userId,
        reservationId,
      )
    );
  }
}
export class CanIssueParkingTicket implements PolicyHandler {
  handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef } = context;
    return reservationAuthServiceFromModuleRef(moduleRef).canIssueParkingTicket(
      userId,
    );
  }
}
export class CanReturnParkingTicket implements PolicyHandler {
  handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef } = context;
    return reservationAuthServiceFromModuleRef(
      moduleRef,
    ).canReturnParkingTicket(userId);
  }
}
const reservationAuthServiceFromModuleRef = (moduleRef: ModuleRef) =>
  moduleRef.get(ReservationAuthorizationService);

export class CanQueryReservations implements PolicyHandler {
  handle(context: PolicyCheckContext): Promise<boolean> {
    const { userId, moduleRef } = context;
    return reservationAuthServiceFromModuleRef(
      moduleRef,
    ).canReturnParkingTicket(userId);
  }
}
