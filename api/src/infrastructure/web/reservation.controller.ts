import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ReservationService } from '../../application/reservation/reservation.service';
import {
  ChangeTimeCommand,
  CreateReservationCommand,
} from '../../application/reservation/reservation.command';
import { Id } from '../../domain/id';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}

  @Post()
  make(@Body() command: CreateReservationCommand) {
    return this.service.makeReservation(command);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: Id) {
    return this.service.confirm(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: Id) {
    return this.service.cancel(id);
  }

  @Patch(':id/time')
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
  issueParkingTicket(@Param('id') reservationId: Id) {
    return this.service.issueParkingTicket(reservationId);
  }

  @Patch(':id/returnParkingTicket')
  returnParkingTicket(@Param('id') reservationId: Id) {
    return this.service.returnParkingTicket(reservationId);
  }
}
