import { Component } from '@angular/core';
import { ReservationBaseComponent } from '../base.component';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  Paging,
  SortBy,
  SortOrder,
} from '../../../core/model/reservation.model';
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
  paging,
  reservations,
  sorting,
} from '../../../core/store/reservations/reservations.selector';

@Component({
  selector: 'sps-driver-reservation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationListComponent extends ReservationBaseComponent {
  driver$ = this.store.select(currentDriver);

  reservations$ = this.store.select(reservations);

  driverLoading$ = this.store.select(driverLoading);

  reservationsLoading$ = this.store.select(reservationsLoading);

  reservationsCount$: Observable<number> = this.store.select(count);

  reservationsSorting$ = this.store.select(sorting);

  reservationsPaging$ = this.store.select(paging);

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

  onPagingChange({ page, pageSize }: Paging) {
    this.store.dispatch(new DriverActions.PagingChange(page, pageSize));
  }

  onSortingChange({
    sortBy,
    sortOrder,
  }: {
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  }) {
    this.store.dispatch(new DriverActions.SortingChange(sortBy, sortOrder));
  }
}
