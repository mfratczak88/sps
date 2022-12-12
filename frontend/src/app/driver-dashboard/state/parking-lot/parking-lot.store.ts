import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ParkingLot } from '../../../core/model/parking-lot.model';

export type ParkingLotState = EntityState<ParkingLot, string>;
@StoreConfig({
  name: 'parking-lots',
})
@Injectable({
  providedIn: 'root',
})
export class ParkingLotStore extends EntityStore<ParkingLotState> {}
