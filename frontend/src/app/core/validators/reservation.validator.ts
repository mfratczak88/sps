import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Id } from '../model/common.model';
import { DateTime } from 'luxon';
import { parkingLotById } from '../store/parking-lot/parking-lot.selectors';

@Injectable({
  providedIn: 'root',
})
export class ReservationValidator {
  constructor(private readonly store: Store) {}

  dateFilterFn(parkingLotId?: Id) {
    const parkingLot =
      parkingLotId && this.store.selectSnapshot(parkingLotById(parkingLotId));
    return (date: Date | null): boolean => {
      if (!date || !parkingLot) return false;
      const dateTime = DateTime.fromJSDate(date);
      return (
        parkingLot.days.includes(dateTime.weekday - 1) &&
        dateTime.diffNow('days').as('days') >= 1
      );
    };
  }
}
