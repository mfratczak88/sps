import { Component, OnInit } from '@angular/core';
import { DrawerKeys } from '../../../core/translation-keys';
import { Store } from '@ngxs/store';
import { reservationsListState } from '../../../core/store/reservations/reservations.selector';
import {
  Paging,
  SortBy,
  SortOrder,
} from '../../../core/model/reservation.model';
import { AdminActions } from '../../../core/store/actions/admin.actions';

@Component({
  selector: 'sps-admin-reservations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationsListComponent implements OnInit {
  translations = { ...DrawerKeys };

  listState = reservationsListState(this.store);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new AdminActions.GetAllReservations());
  }

  onPagingChange({ page, pageSize }: Paging) {
    this.store.dispatch(
      new AdminActions.ReservationsPageChange(page, pageSize),
    );
  }

  onSortingChange({
    sortBy,
    sortOrder,
  }: {
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  }) {
    this.store.dispatch(
      new AdminActions.ReservationsSortingChange(sortBy, sortOrder),
    );
  }
}
