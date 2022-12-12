import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Driver } from '../../../core/model/driver.model';

export interface DriverState extends Driver {
  parkingLotCount: number;
}
export type DriversState = EntityState<DriverState, string>;
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'drivers',
})
export class DriversStore extends EntityStore<DriversState> {}
