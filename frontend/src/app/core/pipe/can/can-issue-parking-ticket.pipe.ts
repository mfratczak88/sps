import { Pipe, PipeTransform } from '@angular/core';
import { Reservation } from '../../model/reservation.model';
import { isNowBefore } from '../../util';

@Pipe({
  name: 'canIssueParkingTicket',
})
export class CanIssueParkingTicketPipe implements PipeTransform {
  transform({ parkingTickets, endTime }: Reservation): unknown {
    return (
      isNowBefore(endTime) &&
      parkingTickets.every(({ timeOfLeave }) => !!timeOfLeave)
    );
  }
}
