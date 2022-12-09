import { Injectable } from '@angular/core';
import { ReservationsStore } from './reservations.store';
import { ReservationApi } from '../../../core/api/reservation.api';
import { Id } from '../../../core/model/common.model';
import { DateTime } from 'luxon';
import {
  Reservation,
  Reservations,
  SortBy,
  SortOrder,
} from '../../../core/model/reservation.model';
import { concatMap, EMPTY, filter, finalize, tap, withLatestFrom } from 'rxjs';
import { ToastKeys } from '../../../core/translation-keys';
import { ToastService } from '../../../core/service/toast.service';
import { DriverQuery } from '../driver/driver.query';
import { RouterQuery } from '../../../core/state/router/router.query';
import { map } from 'rxjs/operators';
import { ReservationsQuery } from './reservations.query';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(
    private readonly store: ReservationsStore,
    private readonly api: ReservationApi,
    private readonly toastService: ToastService,
    private readonly driverQuery: DriverQuery,
    private readonly query: ReservationsQuery,
    private readonly routerQuery: RouterQuery,
  ) {}

  loadForDriver(driverId: Id) {
    this.api
      .getReservations({
        driverId,
      })
      .subscribe(data => this.fillStoreWith(data));
  }

  reloadOnPagingChange$(filters?: { forDriver: boolean }) {
    return this.routerQuery.queryParams$().pipe(
      withLatestFrom(
        this.driverQuery.select(),
        this.routerQuery.reservationId$(),
      ),
      filter(([queryParams, driver, reservationId]) => {
        const { forDriver } = filters || {};
        return (
          !reservationId &&
          !!Object.keys(queryParams).length &&
          (forDriver ? !!driver.id : true)
        );
      }),
      tap(() => this.store.setLoading(true)),
      concatMap(([{ page, pageSize, sortOrder, sortBy }, { id: driverId }]) =>
        this.api.getReservations({
          driverId,
          page: +page,
          pageSize: +pageSize,
          sortOrder: sortOrder as SortOrder,
          sortBy: sortBy as SortBy,
        }),
      ),
      map(data => this.fillStoreWith(data)),
    );
  }

  private fillStoreWith({ data, ...paging }: Reservations) {
    this.store.set(data);
    this.store.update(state => ({
      ...state,
      ...paging,
    }));
  }

  select(id: Id) {
    if (this.query.hasEntity(id)) {
      this.store.setActive(id);
      return EMPTY;
    }
    return this.api.getReservation(id).pipe(
      tap(reservation => {
        this.store.set([reservation]);
        this.store.setActive(reservation.id);
      }),
    );
  }

  canBeChanged(reservation: Reservation) {
    return (
      reservation.approvalDeadLine &&
      DateTime.fromISO(reservation.approvalDeadLine)
        .diffNow('seconds')
        .as('seconds') > 0
    );
  }

  canBeConfirmed(reservation: Reservation) {
    return (
      reservation.approvalTimeStart &&
      DateTime.fromISO(reservation.approvalTimeStart)
        .diffNow('seconds')
        .as('seconds') < 0 &&
      reservation.approvalDeadLine &&
      DateTime.fromISO(reservation.approvalDeadLine)
        .diffNow('seconds')
        .as('seconds') > 0
    );
  }

  canBeCancelled(reservation: Reservation) {
    return (
      DateTime.fromISO(reservation.startTime)
        .diffNow()
        .as('seconds') > 0
    );
  }

  confirmReservation({ id }: Reservation) {
    const { id: driverId } = this.driverQuery.getValue();
    return this.api.confirmReservation(id).pipe(
      tap(() => this.loadForDriver(driverId)),
      tap(() => this.toastService.show(ToastKeys.RESERVATION_CONFIRMED)),
    );
  }

  cancelReservation({ id }: Reservation) {
    const { id: driverId } = this.driverQuery.getValue();
    return this.api.cancelReservation(id).pipe(
      tap(() => this.loadForDriver(driverId)),
      tap(() => this.toastService.show(ToastKeys.RESERVATION_CANCELLED)),
    );
  }

  makeReservation({
    date,
    licensePlate,
    hours: { hourFrom, hourTo },
    parkingLotId,
  }: {
    licensePlate: string;
    hours: {
      hourFrom: number;
      hourTo: number;
    };
    date: Date;
    parkingLotId: string;
  }) {
    const reservationDate = DateTime.fromJSDate(date);
    const start = ReservationsService.fullHour(reservationDate, hourFrom);
    const end = ReservationsService.fullHour(reservationDate, hourTo);
    this.store.setLoading(true);
    return this.api
      .makeReservation({
        start,
        end,
        parkingLotId,
        licensePlate,
      })
      .pipe(
        tap(() => this.toastService.show(ToastKeys.RESERVATION_CREATED)),
        finalize(() => this.store.setLoading(false)),
      );
  }

  static fullHour(dateTime: DateTime, hour: number) {
    return dateTime
      .set({
        hour: hour,
        second: 0,
        minute: 0,
        millisecond: 0,
      })
      .toJSDate();
  }
}
