import { Pipe, PipeTransform } from '@angular/core';
import { ParkingTicket } from '../../model/reservation.model';

@Pipe({
  name: 'canReturnParkingTicket',
})
export class CanReturnParkingTicketPipe implements PipeTransform {
  transform({ timeOfLeave }: ParkingTicket): unknown {
    return !timeOfLeave;
  }
}
