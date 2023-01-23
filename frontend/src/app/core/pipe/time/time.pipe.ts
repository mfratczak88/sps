import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'time',
})
@Injectable()
export class TimePipe implements PipeTransform {
  transform(time: Date | string) {
    const dateTime =
      time instanceof Date ? DateTime.fromJSDate(time) : DateTime.fromISO(time);
    return dateTime.toFormat('HH:mm');
  }
}
