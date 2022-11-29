import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Driver } from '../../../core/model/driver.model';

export type DriversState = EntityState<
  Driver & { parkingLotCount: number },
  string
>;
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'drivers',
})
export class DriversStore extends EntityStore<DriversState> {}
