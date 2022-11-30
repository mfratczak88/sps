import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DriverState, DriverStore } from './driver.store';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DriverQuery extends Query<DriverState> {
  loaded$() {
    return this.selectLoading().pipe(map(loading => !loading));
  }

  constructor(store: DriverStore) {
    super(store);
  }
}
