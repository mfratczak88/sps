import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ReservationsStore, ReservationState } from './reservations.store';
import { DriverQuery } from '../driver/driver.query';
import { concatMap, map, tap } from 'rxjs/operators';
import { Reservation } from '../../../core/model/reservation.model';
import { Observable } from 'rxjs';

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

  active$() {
    return this.selectActive<Reservation>() as Observable<Reservation>;
  }
}