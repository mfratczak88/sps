import { DaysPipe } from './days.pipe';
import { TestBed } from '@angular/core/testing';
import { translateTestModule } from '../../../test.utils';
import { TranslateService } from '@ngx-translate/core';
import {
  DayToShortTranslation,
  OperationTimeDays,
  ParkingLot,
} from '../../core/model/parking-lot.model';
import { mockParkingLots } from '../../../../test/driver.utils';

describe('DaysPipe', () => {
  let daysPipe: DaysPipe;
  let translateService: TranslateService;
  beforeEach(async () => {
    const module = TestBed.configureTestingModule({
      imports: [await translateTestModule()],
    });
    translateService = module.inject(TranslateService);
    daysPipe = new DaysPipe(translateService);
  });

  it('shows first and last day with hyphen if no gap between', () => {
    const lot: ParkingLot = {
      ...mockParkingLots[0],
      days: [
        OperationTimeDays.MONDAY,
        OperationTimeDays.TUESDAY,
        OperationTimeDays.WEDNESDAY,
        OperationTimeDays.THURSDAY,
        OperationTimeDays.FRIDAY,
      ],
    };
    const expectedDaysString =
      translateService.instant(
        DayToShortTranslation[OperationTimeDays.MONDAY],
      ) +
      ' - ' +
      translateService.instant(DayToShortTranslation[OperationTimeDays.FRIDAY]);

    const actualDaysString = daysPipe.transform(lot);

    expect(actualDaysString).toEqual(expectedDaysString);
  });
  it('shows days separated by comma if in some day theres a gap', () => {
    const lot: ParkingLot = {
      ...mockParkingLots[0],
      days: [
        OperationTimeDays.MONDAY,
        OperationTimeDays.TUESDAY,
        OperationTimeDays.FRIDAY,
      ],
    };
    const expectedDaysString = [
      translateService.instant(DayToShortTranslation[OperationTimeDays.MONDAY]),
      translateService.instant(
        DayToShortTranslation[OperationTimeDays.TUESDAY],
      ),
      translateService.instant(DayToShortTranslation[OperationTimeDays.FRIDAY]),
    ].join(', ');

    const actualDaysString = daysPipe.transform(lot);

    expect(actualDaysString).toEqual(expectedDaysString);
  });
});
