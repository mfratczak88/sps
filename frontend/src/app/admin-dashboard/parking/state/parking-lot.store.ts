import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ParkingLot } from '../../../core/model/admin.model';

export type ParkingLotState = EntityState<ParkingLot, string>;
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'parking-lots',
})
export class ParkingLotStore extends EntityStore<ParkingLotState> {}
