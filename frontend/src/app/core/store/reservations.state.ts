import { Id } from '../model/common.model';
import {
  Reservation,
  ReservationStatus,
  SortBy,
  SortOrder,
} from '../model/reservation.model';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ReservationApi } from '../api/reservation.api';
import { DriverActions } from './actions/driver.actions';
import { tap } from 'rxjs';
import { RouterState } from '@ngxs/router-plugin';
import { DateTime } from 'luxon';
import { fullHour } from '../util';

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
}

export const defaults: ReservationsStateModel = {
  filters: {},
  loading: true,
  paging: {},
  entities: {},
  selectedId: null,
  sorting: {},
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

  @Selector()
  static count({ entities }: ReservationsStateModel) {
    return Object.entries(entities).length;
  }

  @Selector()
  static reservations({ entities }: ReservationsStateModel): Reservation[] {
    return Object.values(entities);
  }

  @Selector()
  static loading({ loading }: ReservationsStateModel): boolean {
    return loading;
  }

  @Selector()
  static active({
    selectedId,
    entities,
  }: ReservationsStateModel): Reservation | undefined {
    return selectedId ? entities[selectedId] : undefined;
  }

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

  @Action(DriverActions.TablePagingSortingChange)
  tablePagingSortingChange(
    { dispatch, patchState }: StateContext<ReservationsStateModel>,
    action: DriverActions.TablePagingSortingChange,
  ) {
    patchState({
      sorting: action,
    });
    return dispatch(new DriverActions.GetAllReservations());
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
            reservation.status = ReservationStatus.CONFIRMED;
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
    return this.api.getReservation(id).pipe(
      tap(reservation => {
        patchState({
          entities: { ...entities, [id]: reservation },
          selectedId: id,
        });
      }),
    );
  }

  @Action(DriverActions.GetAllReservations)
  getAllReservations({
    getState,
    patchState,
  }: StateContext<ReservationsStateModel>) {
    const { filters, paging, sorting } = getState();
    const {
      state: { root },
    } = this.store.selectSnapshot(RouterState);
    const { queryParams } = root || {};
    return this.api
      .getReservations({
        ...filters,
        ...paging,
        ...sorting,
        ...queryParams,
      })
      .pipe(
        tap(reservations => {
          const { data, page, pageSize } = reservations;
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
            paging: {
              page,
              pageSize,
            },
          });
        }),
      );
  }
}
