import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ParkingLotState, ParkingLotStore } from './parking-lot.store';

import { Observable } from 'rxjs';
import { ParkingLot } from '../../../core/model/parking-lot.model';

@Injectable({
  providedIn: 'root',
})
export class ParkingLotQuery extends QueryEntity<ParkingLotState> {
  constructor(store: ParkingLotStore) {
    super(store);
  }

  active$(): Observable<ParkingLot> {
    return this.selectActive() as Observable<ParkingLot>;
  }
}
