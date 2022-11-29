import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DriverState, DriverStore } from './driver.store';

@Injectable({
  providedIn: 'root',
})
export class DriverQuery extends Query<DriverState> {
  constructor(store: DriverStore) {
    super(store);
  }
}
