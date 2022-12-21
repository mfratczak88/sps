import { Component, OnInit } from '@angular/core';
import { ReservationBaseComponent } from '../base.component';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Reservation } from '../../../core/model/reservation.model';
import { MatDialog } from '@angular/material/dialog';
import { DriverActions } from '../../../core/store/actions/driver.actions';
import { RoutingState } from '../../../core/store/routing.state';
import { ReservationsState } from '../../../core/store/reservations.state';
import { ReservationValidator } from '../../../core/validators/reservation.validator';

@Component({
  selector: 'sps-reservation-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class ReservationDetailsComponent extends ReservationBaseComponent
  implements OnInit {
  @Select(ReservationsState.active)
  reservation$: Observable<Reservation | undefined>;

  @Select(ReservationsState.loading)
  loading$: Observable<boolean>;

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
        this.store.selectSnapshot(RoutingState.reservationId),
      ),
    );
  }

  toReservationsList() {
    this.store.dispatch(new DriverActions.NavigateToReservationList());
  }
}
