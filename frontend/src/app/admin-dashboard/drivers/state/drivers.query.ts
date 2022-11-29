import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversState, DriversStore } from './drivers.store';
import { combineLatestWith, Observable } from 'rxjs';

import { ParkingLotQuery } from '../../parking/state/parking-lot.query';
import { ParkingLotAdminModel } from '../../../core/model/parking-lot.model';
import { map } from 'rxjs/operators';
import { Driver } from '../../../core/model/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriversQuery extends QueryEntity<DriversState> {
  constructor(
    store: DriversStore,
    private readonly parkingLotQuery: ParkingLotQuery,
  ) {
    super(store);
  }

  active$() {
    return <Observable<Driver>>this.selectActive();
  }

  driverUnAssignedParkingLots$(): Observable<ParkingLotAdminModel[]> {
    return this.active$().pipe(
      combineLatestWith(this.parkingLotQuery.selectAll()),
      map(([driver, parkingLots]) => {
        const driverLotsIds = driver.parkingLots.map(({ id }) => id);
        return parkingLots.filter(({ id }) => !driverLotsIds.includes(id));
      }),
    );
  }
}
