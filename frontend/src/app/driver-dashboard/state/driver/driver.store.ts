import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { DriverReservation, Vehicle } from '../../../core/model/driver.model';
import { ParkingLot } from '../../../core/model/parking-lot.model';

export interface DriverState {
  id: string;
  name: string;
  email: string;
  parkingLots: ParkingLot[];
  vehicles: Vehicle[];
  pendingAction: DriverReservation[];
  dueNext: DriverReservation[];
  history: DriverReservation[];
}
@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'driver',
})
export class DriverStore extends Store<DriverState> {
  constructor() {
    super({
      id: '',
      name: '',
      email: '',
      parkingLots: [],
      vehicles: [],
      pendingAction: [],
      dueNext: [],
      history: [],
    });
  }
}
