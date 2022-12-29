import { Id } from '../../model/common.model';
import {
  Reservation,
  ReservationStatus,
  SortBy,
  SortOrder,
} from '../../model/reservation.model';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ReservationApi } from '../../api/reservation.api';
import { DriverActions } from '../actions/driver.actions';
import { concatMap, tap } from 'rxjs';
import { DateTime } from 'luxon';
import { fullHour } from '../../util';
import { queryParams } from '../routing/routing.selector';
export interface ReservationsStateModel {
  selectedId: Id | null;
  entities: {
    [id: Id]: Reservation;
  };
  loading: boolean;
  filters: {
    driverId?: Id;
    onlyHistory?: boolean;
  };
  paging: {
    pageSize?: number;
    page?: number;
  };
  sorting: {
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  };
  count: number;
}

export const defaults: ReservationsStateModel = {
  filters: {},
  loading: true,
  paging: {},
  entities: {},
  selectedId: null,
  sorting: {},
  count: 0,
};

@State<ReservationsStateModel>({
  name: 'reservations',
  defaults,
})
@Injectable({
  providedIn: 'root',
})
export class ReservationsState {
  constructor(
    private readonly api: ReservationApi,
    private readonly store: Store,
  ) {}

  @Action(DriverActions.ReservationFiltersChange)
  reservationsFilterChange(
    { patchState, dispatch }: StateContext<ReservationsStateModel>,
    action: DriverActions.ReservationFiltersChange,
  ) {
    patchState({
      filters: action,
    });
    return dispatch(new DriverActions.GetAllReservations());
  }

  @Action(DriverActions.SortingChange)
  tablePagingSortingChange(
    { dispatch, patchState, getState }: StateContext<ReservationsStateModel>,
    { sortBy, sortOrder }: DriverActions.SortingChange,
  ) {
    const queryParams = { sortBy, sortOrder, page: 1 };
    const { page } = queryParams;
    const {
      paging: { pageSize },
    } = getState();
    patchState({
      sorting: { sortBy, sortOrder },
      paging: { page },
    });
    return dispatch(
      new DriverActions.QueryParamsChange(page, pageSize, sortBy, sortOrder),
    ).pipe(concatMap(() => dispatch(new DriverActions.GetAllReservations())));
  }

  @Action(DriverActions.PagingChange)
  pagingChange(
    { dispatch, patchState, getState }: StateContext<ReservationsStateModel>,
    { pageSize, page }: DriverActions.PagingChange,
  ) {
    const {
      sorting: { sortBy, sortOrder },
    } = getState();
    patchState({
      paging: {
        page: page || 1,
        pageSize: pageSize || 5,
      },
    });
    return dispatch(
      new DriverActions.QueryParamsChange(page, pageSize, sortBy, sortOrder),
    ).pipe(concatMap(() => dispatch(new DriverActions.GetAllReservations())));
  }

  @Action(DriverActions.CancelReservation)
  cancelReservation(
    { patchState, getState, dispatch }: StateContext<ReservationsStateModel>,
    { id }: DriverActions.CancelReservation,
  ) {
    return this.api.cancelReservation(id).pipe(
      tap(() => {
        const { entities } = getState();
        const reservation = entities[id];
        if (reservation) {
          reservation.status = ReservationStatus.CANCELLED;
          patchState({
            entities: {
              ...entities,
              [id]: reservation,
            },
          });
        }
        dispatch(new DriverActions.ReservationChanged(id));
      }),
    );
  }

  @Action(DriverActions.ConfirmReservation)
  confirmReservation(
    { patchState, getState, dispatch }: StateContext<ReservationsStateModel>,
    { id }: DriverActions.ConfirmReservation,
  ) {
    return this.api.confirmReservation(id).pipe(
      tap(() => {
        const { entities } = getState();
        const reservation = entities[id];
        if (reservation) {
          reservation.status = ReservationStatus.CONFIRMED;
          patchState({
            entities: {
              ...entities,
              [id]: reservation,
            },
          });
        }
        dispatch(new DriverActions.ReservationChanged(id));
      }),
    );
  }

  @Action(DriverActions.CreateReservation)
  createReservation(
    { dispatch }: StateContext<ReservationsStateModel>,
    {
      date,
      hours: { hourFrom, hourTo },
      licensePlate,
      parkingLotId,
    }: DriverActions.CreateReservation,
  ) {
    const newDate = DateTime.fromJSDate(date);
    const start = fullHour(newDate, hourFrom);
    const end = fullHour(newDate, hourTo);
    return this.api
      .makeReservation({
        start,
        end,
        licensePlate,
        parkingLotId,
      })
      .pipe(
        tap(() => {
          dispatch(new DriverActions.GetAllReservations());
        }),
      );
  }

  @Action(DriverActions.ChangeTimeOfReservation)
  changeTime(
    { dispatch, getState, patchState }: StateContext<ReservationsStateModel>,
    {
      date,
      hours: { hourFrom, hourTo },
      reservationId,
    }: DriverActions.ChangeTimeOfReservation,
  ) {
    const newDate = DateTime.fromJSDate(date);
    const start = fullHour(newDate, hourFrom);
    const end = fullHour(newDate, hourTo);
    return this.api
      .changeTime({
        start,
        end,
        reservationId,
      })
      .pipe(
        tap(() => {
          const { entities } = getState();
          const reservation = entities[reservationId];
          if (reservation) {
            patchState({
              entities: {
                ...entities,
                [reservationId]: reservation,
              },
            });
          }
          dispatch(new DriverActions.ReservationChanged(reservationId));
        }),
      );
  }

  @Action(DriverActions.GetReservationById)
  getReservation(
    { getState, patchState }: StateContext<ReservationsStateModel>,
    { id }: DriverActions.GetReservationById,
  ) {
    const { entities } = getState();
    if (entities[id]) {
      return patchState({ selectedId: id });
    }
    patchState({
      loading: true,
    });
    return this.api.getReservation(id).pipe(
      tap(reservation => {
        patchState({
          entities: { ...entities, [id]: reservation },
          selectedId: id,
          loading: false,
        });
      }),
    );
  }

  @Action(DriverActions.GetAllReservations)
  getAllReservations(ctx: StateContext<ReservationsStateModel>) {
    const { filters, paging, sorting } = this.apiCallQueryParamsFrom(ctx);
    return this.api
      .getReservations({
        ...filters,
        ...paging,
        ...sorting,
      })
      .pipe(
        tap(reservations => {
          const { patchState } = ctx;
          const { data, page, pageSize, count } = reservations;
          const entities = data.reduce((entities, reservation) => {
            const { id } = reservation;
            return {
              ...entities,
              [id]: reservation,
            };
          }, {});
          patchState({
            loading: false,
            entities,
            count,
            paging: {
              page,
              pageSize,
            },
            ...sorting,
          });
        }),
      );
  }

  private apiCallQueryParamsFrom({
    getState,
  }: StateContext<ReservationsStateModel>) {
    const { filters } = getState();
    const qParams = this.store.selectSnapshot(queryParams);
    const { sortBy, sortOrder } = qParams;
    const { page, pageSize } = qParams;
    const paging = {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 5,
    };
    return {
      filters,
      sorting: { sortBy, sortOrder },
      paging,
    };
  }
}
