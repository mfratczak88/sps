import { Component, OnInit } from '@angular/core';
import { ReservationBaseComponent } from '../base.component';
import { Store } from '@ngxs/store';
import { MatDialog } from '@angular/material/dialog';
import { DriverActions } from '../../../core/store/actions/driver.actions';
import { ReservationValidator } from '../../../core/validators/reservation.validator';
import {
  active,
  loading,
} from '../../../core/store/reservations/reservations.selector';
import { reservationId } from '../../../core/store/routing/routing.selector';

@Component({
  selector: 'sps-reservation-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class ReservationDetailsComponent extends ReservationBaseComponent
  implements OnInit {
  reservation$ = this.store.select(active);

  loading$ = this.store.select(loading);

  constructor(
    store: Store,
    dialog: MatDialog,
    validator: ReservationValidator,
  ) {
    super(store, dialog, validator);
  }

  ngOnInit(): void {
    this.store.dispatch(
      new DriverActions.GetReservationById(
        this.store.selectSnapshot(reservationId),
      ),
    );
  }

  toReservationsList() {
    this.store.dispatch(new DriverActions.NavigateToReservationList());
  }
}
