import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DriverState, DriverStore } from './driver.store';
import { map } from 'rxjs/operators';
import { ParkingLotQuery } from '../parking-lot/parking-lot.query';
import { combineLatestWith } from 'rxjs';

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

  reservationsHistory$() {
    return this.select().pipe(map(reservation => reservation.history));
  }
}
