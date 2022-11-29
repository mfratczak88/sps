import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ParkingLotState, ParkingLotStore } from './parking-lot.store';
import { ParkingLotAdminModel } from '../../../core/model/parking-lot.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParkingLotQuery extends QueryEntity<ParkingLotState> {
  constructor(store: ParkingLotStore) {
    super(store);
  }

  active$(): Observable<ParkingLotAdminModel> {
    return this.selectActive() as Observable<ParkingLotAdminModel>;
  }
}
