import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Driver } from '../../core/model/driver.model';

export type DriverState = Driver;

@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'driver',
})
export class DriverStore extends Store<DriverState> {
  constructor() {
    super({
      id: '',
      name: '',
      email: '',
      parkingLots: [],
      unAssignedLots: [],
      vehicles: [],
    });
  }
}
