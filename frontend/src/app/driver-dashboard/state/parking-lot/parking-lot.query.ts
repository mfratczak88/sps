import { QueryEntity } from '@datorama/akita';
import { ParkingLotState, ParkingLotStore } from './parking-lot.store';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ParkingLotQuery extends QueryEntity<ParkingLotState> {
  constructor(store: ParkingLotStore) {
    super(store);
  }
}
