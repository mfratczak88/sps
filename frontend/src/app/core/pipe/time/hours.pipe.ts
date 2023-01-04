import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours',
})
@Injectable({
  providedIn: 'root',
})
export class HoursPipe implements PipeTransform {
  transform(hours: { hourFrom?: number; hourTo?: number }): unknown {
    const { hourFrom, hourTo } = hours;
    return `${hourFrom} - ${hourTo}`;
  }
}
