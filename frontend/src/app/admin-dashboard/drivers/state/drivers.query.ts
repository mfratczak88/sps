import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversState, DriversStore } from './drivers.store';
import { combineLatestWith, Observable } from 'rxjs';

import { ParkingLotQuery } from '../../parking/state/parking-lot.query';
import { map } from 'rxjs/operators';
import { ParkingLot } from '../../../core/model/parking-lot.model';
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

  driverParkingLots$() {
    return this.active$().pipe(
      combineLatestWith(this.parkingLotQuery.selectAll()),
      map(([driver, parkingLots]) => {
        return parkingLots.filter(
          ({ id }) => !driver.parkingLotIds.find(lotId => id === lotId),
        );
      }),
    );
  }

  driverUnAssignedParkingLots$(): Observable<ParkingLot[]> {
    return this.active$().pipe(
      combineLatestWith(this.parkingLotQuery.selectAll()),
      map(([driver, parkingLots]) => {
        return parkingLots.filter(
          ({ id }) => !driver.parkingLotIds.find(lotId => id === lotId),
        );
      }),
    );
  }
}
