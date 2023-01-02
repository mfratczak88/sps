import { createSelector } from '@ngxs/store';
import {
  ReservationsState,
  ReservationsStateModel,
} from './reservations.state';
import { Reservation, SortBy, SortOrder } from '../../model/reservation.model';
import { allEntities, loadingSelector, selectedEntity } from '../selectors';

export const loading = loadingSelector([ReservationsState]);
export const active = selectedEntity<Reservation, ReservationsStateModel>([
  ReservationsState,
]);

export const reservations = allEntities<Reservation, ReservationsStateModel>([
  ReservationsState,
]);

export const sorting = createSelector(
  [ReservationsState],
  ({ sorting }: ReservationsStateModel) => {
    const { sortBy, sortOrder } = sorting;
    return {
      sortOrder: sortOrder || SortOrder.DESCENDING,
      sortBy: sortBy || SortBy.CREATED_AT,
    };
  },
);

export const paging = createSelector(
  [ReservationsState],
  ({ paging }: ReservationsStateModel) => {
    const { page, pageSize } = paging;
    return {
      page: page || 1,
      pageSize: pageSize || 5,
    };
  },
);
export const count = createSelector(
  [ReservationsState],
  ({ count }: ReservationsStateModel) => count,
);
