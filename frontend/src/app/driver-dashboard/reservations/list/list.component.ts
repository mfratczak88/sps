import { Component } from '@angular/core';
import { ReservationBaseComponent } from '../base.component';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Driver } from '../../../core/model/driver.model';
import { Reservation } from '../../../core/model/reservation.model';
import { DriverActions } from '../../../core/store/actions/driver.actions';
import { MatDialog } from '@angular/material/dialog';
import { ReservationValidator } from '../../../core/validators/reservation.validator';
import {
  currentDriver,
  loading as driverLoading,
} from '../../../core/store/drivers/drivers.selectors';
import {
  count,
  loading as reservationsLoading,
  reservations,
} from '../../../core/store/reservations/reservations.selector';

@Component({
  selector: 'sps-driver-reservation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationListComponent extends ReservationBaseComponent {
  driver$: Observable<Driver | undefined> = this.store.select(currentDriver);

  reservations$: Observable<Reservation[]> = this.store.select(reservations);

  driverLoading$: Observable<boolean> = this.store.select(driverLoading);

  reservationsLoading$: Observable<boolean> = this.store.select(
    reservationsLoading,
  );

  reservationsCount$: Observable<number> = this.store.select(count);

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
