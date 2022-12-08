import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { JwtAuthGuard } from '../../security/authorization/jwt-auth.guard';
import { CsrfGuard } from '../../security/csrf/csrf.guard';
import { ReservationFinder } from '../../../application/reservation/reservation.finder';
import { ReservationQuery } from '../../../application/reservation/reservation.read-model';

@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly service: ReservationService,
    private readonly finder: ReservationFinder,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, CsrfGuard, PoliciesGuard)
  @CheckPolicies(new CanCreateReservation())
  make(@Body() command: CreateReservationCommand) {
    return this.service.makeReservation(command);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, CsrfGuard, PoliciesGuard)
  @CheckPolicies(new CanConfirmReservation())
  confirm(@Param('id') id: Id) {
    return this.service.confirm(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, CsrfGuard, PoliciesGuard)
  @CheckPolicies(new CanCancelReservation())
  cancel(@Param('id') id: Id) {
    return this.service.cancel(id);
  }

  @Patch(':id/time')
  @UseGuards(JwtAuthGuard, CsrfGuard, PoliciesGuard)
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
  @UseGuards(JwtAuthGuard, CsrfGuard, PoliciesGuard)
  @CheckPolicies(new CanIssueParkingTicket())
  issueParkingTicket(@Param('id') reservationId: Id) {
    return this.service.issueParkingTicket(reservationId);
  }

  @Patch(':id/returnParkingTicket')
  @UseGuards(JwtAuthGuard, CsrfGuard, PoliciesGuard)
  @CheckPolicies(new CanReturnParkingTicket())
  returnParkingTicket(@Param('id') reservationId: Id) {
    return this.service.returnParkingTicket(reservationId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Query() query: ReservationQuery) {
    return this.finder.findAll(query);
  }
}
