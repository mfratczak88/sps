import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Driver } from './drivers.model';

export type DriversState = EntityState<Driver, string>;
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'drivers',
})
export class DriversStore extends EntityStore<DriversState> {}
