import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hours',
})
@Injectable({
  providedIn: 'root',
})
export class HoursPipe implements PipeTransform {
  transform(hours: { hourFrom?: string; hourTo?: string }): unknown {
    const { hourFrom, hourTo } = hours;
    return `${hourFrom} - ${hourTo}`;
  }
}
