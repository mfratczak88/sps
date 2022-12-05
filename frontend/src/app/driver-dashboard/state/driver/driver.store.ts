import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Vehicle } from '../../../core/model/driver.model';
import { ReservationWithParkingLot } from '../../../core/model/reservation.model';
import { ParkingLot } from '../../../core/model/parking-lot.model';

export interface DriverState {
  id: string;
  name: string;
  email: string;
  parkingLots: ParkingLot[];
  vehicles: Vehicle[];
  reservationsHistory: ReservationWithParkingLot[];
  reservationsPendingApproval: ReservationWithParkingLot[];
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
      reservationsHistory: [],
      reservationsPendingApproval: [],
    });
  }
}
