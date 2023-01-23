import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Reservation } from '../../model/reservation.model';
import { TimePipe } from './time.pipe';

@Pipe({
  name: 'spsReservationTime',
})
@Injectable()
export class SpsReservationTimePipe implements PipeTransform {
  transform(reservation: Reservation | undefined): unknown {
    const timePipe = new TimePipe();
    const { startTime, endTime } = reservation ?? {};
    if (!startTime || !endTime) return '';
    return `${timePipe.transform(startTime)} - ${timePipe.transform(endTime)}`;
  }
}
