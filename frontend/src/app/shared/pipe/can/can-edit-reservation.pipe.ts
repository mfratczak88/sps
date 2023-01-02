import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Reservation } from '../../../core/model/reservation.model';
import { isNowBefore } from './time.util';

@Pipe({
  name: 'canEditReservation',
})
@Injectable()
export class CanEditReservationPipe implements PipeTransform {
  transform(reservation: Reservation): boolean {
    const { approvalDeadLine } = reservation;
    return !!(approvalDeadLine && isNowBefore(approvalDeadLine));
  }
}
