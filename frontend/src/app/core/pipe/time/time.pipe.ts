import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { Reservation } from '../../model/reservation.model';

@Pipe({
  name: 'time',
})
@Injectable()
export class TimePipe implements PipeTransform {
  transform(reservation: Reservation | undefined): unknown {
    const { startTime, endTime } = reservation ?? {};
    if (!startTime || !endTime) return '';
    const start = TimePipe.transformTime(startTime);
    const end = TimePipe.transformTime(endTime);
    return `${start} - ${end}`;
  }

  private static transformTime(time: Date | string) {
    const dateTime =
      time instanceof Date ? DateTime.fromJSDate(time) : DateTime.fromISO(time);
    return dateTime.toFormat('HH:mm');
  }
}
