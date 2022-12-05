import { Injectable } from '@angular/core';
import { combineQueries, Query } from '@datorama/akita';
import { DriverState, DriverStore } from './driver.store';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { ParkingLotQuery } from '../parking-lot/parking-lot.query';
import { combineLatestWith } from 'rxjs';
import {
  Reservation,
  ReservationWithParkingLot,
} from '../../../core/model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class DriverQuery extends Query<DriverState> {
  constructor(
    store: DriverStore,
    private readonly parkingLotQuery: ParkingLotQuery,
  ) {
    super(store);
  }

  loaded$() {
    return this.selectLoading().pipe(map(loading => !loading));
  }

  unAssignedParkingLots$() {
    return this.select().pipe(
      combineLatestWith(this.parkingLotQuery.selectAll()),
      map(([driver, lots]) =>
        lots.filter(({ id }) => !driver.parkingLots.find(lot => lot.id === id)),
      ),
    );
  }
}
