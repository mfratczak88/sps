import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from '../../../application/reservation/reservation.service';
import {
  ChangeTimeCommand,
  CreateReservationCommand,
} from '../../../application/reservation/reservation.command';
import { Id } from '../../../domain/id';
import { PoliciesGuard } from '../../security/authorization/policy/policies.guard';
import { CheckPolicies } from '../../security/authorization/policy/check-policies.decorator';
import {
  CanCancelReservation,
  CanChangeTimeOfReservation,
  CanConfirmReservation,
  CanCreateReservation,
  CanIssueParkingTicket,
  CanReturnParkingTicket,
} from '../../security/authorization/policy/reservation.policy';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CanCreateReservation())
  make(@Body() command: CreateReservationCommand) {
    return this.service.makeReservation(command);
  }

  @Patch(':id/confirm')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CanConfirmReservation())
  confirm(@Param('id') id: Id) {
    return this.service.confirm(id);
  }

  @Patch(':id/cancel')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CanCancelReservation())
  cancel(@Param('id') id: Id) {
    return this.service.cancel(id);
  }

  @Patch(':id/time')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CanChangeTimeOfReservation())
  changeTime(
    @Param('id') reservationId: Id,
    @Body() command: ChangeTimeCommand,
  ) {
    return this.service.changeTime({
      ...command,
      reservationId,
    });
  }

  @Post(':id/issueParkingTicket')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CanIssueParkingTicket())
  issueParkingTicket(@Param('id') reservationId: Id) {
    return this.service.issueParkingTicket(reservationId);
  }

  @Patch(':id/returnParkingTicket')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CanReturnParkingTicket())
  returnParkingTicket(@Param('id') reservationId: Id) {
    return this.service.returnParkingTicket(reservationId);
  }
}
