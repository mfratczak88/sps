import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ParkingLotAdminModel } from '../../../core/model/parking-lot.model';

export type ParkingLotState = EntityState<ParkingLotAdminModel, string>;
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'parking-lots',
})
export class ParkingLotStore extends EntityStore<ParkingLotState> {}
