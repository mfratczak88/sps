import { Component } from '@angular/core';
import { ReservationBaseComponent } from '../base.component';
import { Select, Store } from '@ngxs/store';
import { DriversState } from '../../../core/store/drivers.state';
import { Observable } from 'rxjs';
import { Driver } from '../../../core/model/driver.model';
import { ReservationsState } from '../../../core/store/reservations.state';
import { Reservation } from '../../../core/model/reservation.model';
import { DriverActions } from '../../../core/store/actions/driver.actions';
import { MatDialog } from '@angular/material/dialog';
import { ReservationValidator } from '../../../core/validators/reservation.validator';

@Component({
  selector: 'sps-driver-reservation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationListComponent extends ReservationBaseComponent {
  @Select(DriversState.currentDriver)
  driver$: Observable<Driver>;

  @Select(ReservationsState.reservations)
  reservations$: Observable<Reservation[]>;

  @Select(DriversState.loading)
  driverLoading$: Observable<boolean>;

  @Select(ReservationsState.loading)
  reservationsLoading$: Observable<boolean>;

  @Select(ReservationsState.count)
  reservationsCount$: Observable<number>;

  constructor(
    store: Store,
    dialog: MatDialog,
    validator: ReservationValidator,
  ) {
    super(store, dialog, validator);
  }

  toDetails(id: any) {
    this.store.dispatch(new DriverActions.NavigateToReservationDetails(id));
  }

  toCreateReservation() {
    this.store.dispatch(new DriverActions.NavigateToCreateReservation());
  }
}
