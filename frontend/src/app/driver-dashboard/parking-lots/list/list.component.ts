import { Component } from '@angular/core';
import { DriverKeys } from '../../../core/translation-keys';
import { Select, Store } from '@ngxs/store';
import { DriversState } from '../../../core/store/drivers.state';
import { Observable } from 'rxjs';
import { ParkingLot } from '../../../core/model/parking-lot.model';

@Component({
  selector: 'sps-driver-parking-lot-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ParkingLotsListComponent {
  translations = { ...DriverKeys };

  @Select(DriversState.assignedParkingLots)
  driverParkingLots$: Observable<ParkingLot[]>;

  @Select(DriversState.unAssignedParkingLots)
  unAssignedParkingLots$: Observable<ParkingLot[]>;

  @Select(DriversState.loading)
  loading$: Observable<boolean>;

  constructor(readonly store: Store) {}
}
