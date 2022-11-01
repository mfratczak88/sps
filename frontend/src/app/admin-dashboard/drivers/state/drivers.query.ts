import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversState, DriversStore } from './drivers.store';
import { combineLatestWith, Observable } from 'rxjs';
import { Driver } from './drivers.model';
import { ParkingLotQuery } from '../../parking/state/parking-lot.query';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DriversQuery extends QueryEntity<DriversState> {
  active$: Observable<Driver> = <Observable<Driver>>this.selectActive();

  driverUnAssignedParkingLots$: Observable<ParkingLot[]> = this.active$.pipe(
    combineLatestWith(this.parkingLotQuery.selectAll()),
    map(([driver, parkingLots]) => {
      const driverLotsIds = driver.parkingLots.map(({ id }) => id);
      return parkingLots.filter(({ id }) => !driverLotsIds.includes(id));
    }),
  );

  constructor(
    store: DriversStore,
    private readonly parkingLotQuery: ParkingLotQuery,
  ) {
    super(store);
  }
}
