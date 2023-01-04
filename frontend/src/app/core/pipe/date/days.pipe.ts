import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
  DayToShortTranslation,
  OperationTimeDays,
} from '../../model/common.model';
import { ParkingLot } from '../../model/parking-lot.model';

@Pipe({
  name: 'days',
})
@Injectable({
  providedIn: 'root',
})
export class DaysPipe implements PipeTransform {
  constructor(private readonly translationService: TranslateService) {}

  transform(lot?: Partial<ParkingLot>): unknown {
    if (!lot || !lot.days) return '';
    const { days } = lot;
    for (let i = 1; i < days.length; i++) {
      if (days[i] - days[i - 1] > 1) {
        return this.allDaysSeparatedByComa(days);
      }
    }
    return `${this.translationService.instant(
      DayToShortTranslation[days[0]],
    )} - ${this.translationService.instant(
      DayToShortTranslation[days[days.length - 1]],
    )}`;
  }

  allDaysSeparatedByComa(days: OperationTimeDays[]) {
    return days
      .map(d => this.translationService.instant(DayToShortTranslation[d]))
      .join(', ');
  }
}
