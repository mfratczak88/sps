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
import { tap } from 'rxjs';
import { DateTime } from 'luxon';
import { fullHour, mapToObjectWithIds, today } from '../../util';
import { queryParams } from '../routing/routing.selector';
import { UiActions } from '../actions/ui.actions';
import { ToastKeys } from '../../translation-keys';
import { ClerkActions } from '../actions/clerk.actions';

export interface ReservationsStateModel {
  selectedId: Id | null;
  entities: {
    [id: Id]: Reservation;
  };
  loading: boolean;
  filters: {
    driverId?: Id;
    onlyHistory?: boolean;
    licensePlate?: string;
    startTime?: Date;
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
    ).pipe(tap(() => dispatch(new DriverActions.GetAllReservations())));
  }

  @Action([DriverActions.PagingChange, ClerkActions.ReservationPageChanged])
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
    ).pipe(tap(() => dispatch(new DriverActions.GetAllReservations())));
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
      tap(() =>
        dispatch(new UiActions.ShowToast(ToastKeys.RESERVATION_CANCELLED)),
      ),
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
      tap(() =>
        dispatch(new UiActions.ShowToast(ToastKeys.RESERVATION_CONFIRMED)),
      ),
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
        tap(() =>
          dispatch(new UiActions.ShowToast(ToastKeys.RESERVATION_CREATED)),
        ),
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
        tap(() =>
          dispatch(new UiActions.ShowToast(ToastKeys.RESERVATION_TIME_CHANGED)),
        ),
      );
  }

  @Action([DriverActions.GetReservationById, ClerkActions.ReloadReservation])
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

  @Action([DriverActions.GetAllReservations, ClerkActions.FindReservations])
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
          const entities = mapToObjectWithIds(data);
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

  @Action(ClerkActions.IssueParkingTicket)
  issueParkingTicket(
    { dispatch }: StateContext<ReservationsStateModel>,
    { reservationId }: ClerkActions.IssueParkingTicket,
  ) {
    return this.api
      .issueParkingTicket(reservationId)
      .pipe(
        tap(() => dispatch(new ClerkActions.ReloadReservation(reservationId))),
      );
  }

  @Action(ClerkActions.ReturnParkingTicket)
  returnParkingTicket(
    { dispatch }: StateContext<ReservationsStateModel>,
    { reservationId }: ClerkActions.ReturnParkingTicket,
  ) {
    return this.api
      .returnParkingTicket(reservationId)
      .pipe(
        tap(() => dispatch(new ClerkActions.ReloadReservation(reservationId))),
      );
  }

  @Action(ClerkActions.ApplyLicensePlateFilter)
  applyLicensePlateFilter(
    { dispatch, patchState }: StateContext<ReservationsStateModel>,
    { licensePlate }: ClerkActions.ApplyLicensePlateFilter,
  ) {
    if (!licensePlate) return patchState({ ...defaults, loading: false });
    patchState({ filters: { startTime: today(), licensePlate } });
    return dispatch(new ClerkActions.FindReservations());
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
