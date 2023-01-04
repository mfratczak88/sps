import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hour',
})
export class HourPipe implements PipeTransform {
  transform(hour: number): unknown {
    return `${hour < 10 ? '0' + hour : hour}:00`;
  }
}
