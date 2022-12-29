import { createSelector } from '@ngxs/store';
import {
  ReservationsState,
  ReservationsStateModel,
} from './reservations.state';
import { SortBy, SortOrder } from '../../model/reservation.model';

export const loading = createSelector(
  [ReservationsState],
  ({ loading }: ReservationsStateModel) => loading,
);

export const active = createSelector(
  [ReservationsState],
  ({ selectedId, entities }: ReservationsStateModel) =>
    selectedId ? entities[selectedId] : undefined,
);

export const reservations = createSelector(
  [ReservationsState],
  ({ entities }: ReservationsStateModel) => Object.values(entities),
);

export const sorting = createSelector(
  [ReservationsState],
  ({ sorting }: ReservationsStateModel) => {
    const { sortBy, sortOrder } = sorting;
    return {
      sortOrder: (sortOrder || 'desc') as SortOrder,
      sortBy: (sortBy || 'date') as SortBy,
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
