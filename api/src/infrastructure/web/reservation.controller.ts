import { Body, Controller, Post } from '@nestjs/common';
import { ReservationService } from '../../application/reservation/reservation.service';
import { CreateReservationCommand } from '../../application/reservation/reservation.command';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly service: ReservationService) {}
  @Post()
  make(@Body() command: CreateReservationCommand) {
    return this.service.makeReservation(command);
  }
}
