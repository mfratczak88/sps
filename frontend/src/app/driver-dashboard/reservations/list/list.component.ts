import { Component } from '@angular/core';
import { ReservationBaseComponent } from '../base.component';
import { Store } from '@ngxs/store';
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
import { reservationsListState } from '../../../core/store/reservations/reservations.selector';

@Component({
  selector: 'sps-driver-reservation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationListComponent extends ReservationBaseComponent {
  driver$ = this.store.select(currentDriver);

  driverLoading$ = this.store.select(driverLoading);

  reservationsList = reservationsListState(this.store);

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
