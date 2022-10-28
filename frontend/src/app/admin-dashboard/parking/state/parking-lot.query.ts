import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ParkingLotState, ParkingLotStore } from './parking-lot.store';
import { ParkingLot } from './parking-lot.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParkingLotQuery extends QueryEntity<ParkingLotState> {
  loading$ = this.selectLoading();

  active$: Observable<ParkingLot> = this.selectActive() as Observable<
    ParkingLot
  >;

  constructor(store: ParkingLotStore) {
    super(store);
  }
}
