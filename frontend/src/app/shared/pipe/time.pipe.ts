import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'time',
})
@Injectable()
export class TimePipe implements PipeTransform {
  transform(props: { date?: Date | string; time?: Date | string }): unknown {
    const { time, date } = props ?? {};
    return time
      ? this.transformTime(time)
      : date
      ? this.transformDate(date)
      : '';
  }

  transformTime(time: Date | string) {
    const dateTime =
      time instanceof Date ? DateTime.fromJSDate(time) : DateTime.fromISO(time);
    return dateTime.toFormat('HH:mm');
  }

  transformDate(date: Date | string) {
    const dateTime =
      date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date);
    return dateTime.toFormat('dd.MM.yyyy');
  }
}
