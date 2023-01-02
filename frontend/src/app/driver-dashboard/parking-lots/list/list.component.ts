import { Component } from '@angular/core';
import { DriverKeys } from '../../../core/translation-keys';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import {
  assignedParkingLots,
  loading,
  unAssignedParkingLots,
} from '../../../core/store/drivers/drivers.selectors';

@Component({
  selector: 'sps-driver-parking-lot-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ParkingLotsListComponent {
  translations = { ...DriverKeys };

  driverParkingLots$: Observable<ParkingLot[]> = this.store.select(
    assignedParkingLots,
  );

  unAssignedParkingLots$: Observable<ParkingLot[]> = this.store.select(
    unAssignedParkingLots,
  );

  loading$: Observable<boolean> = this.store.select(loading);

  constructor(readonly store: Store) {}
}
