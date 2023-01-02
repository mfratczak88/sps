import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'spsDate',
})
export class DatePipe implements PipeTransform {
  transform(date: Date | string | undefined): string {
    if (!date) return '';
    const dateTime =
      date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date);
    return dateTime.toFormat('dd.MM.yyyy');
  }
}
