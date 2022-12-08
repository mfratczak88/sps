import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ReservationsStore, ReservationState } from './reservations.store';
import { DriverQuery } from '../driver/driver.query';
import { concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReservationsQuery extends QueryEntity<ReservationState> {
  constructor(
    store: ReservationsStore,
    private readonly driverQuery: DriverQuery,
  ) {
    super(store);
  }

  driverReservationHistory$() {
    return this.driverQuery
      .select(['pendingAction', 'dueNext', 'ongoing'])
      .pipe(
        map(({ pendingAction, dueNext, ongoing }) =>
          [...pendingAction, ...dueNext, ...ongoing].map(r => r.id),
        ),
        concatMap(ids =>
          this.selectAll({
            filterBy: ({ id }) => !ids.includes(id),
          }),
        ),
      );
  }

  count$() {
    return this.select('count');
  }
}
