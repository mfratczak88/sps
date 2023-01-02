import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Reservation } from '../../../core/model/reservation.model';
import { isNowBefore } from './time.util';

@Pipe({
  name: 'canCancelReservation',
})
@Injectable()
export class CanCancelReservationPipe implements PipeTransform {
  transform(reservation: Reservation): boolean {
    const { startTime } = reservation;
    return isNowBefore(startTime);
  }
}
