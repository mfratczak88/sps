import { Injectable } from '@angular/core';
import { ReservationsStore } from './reservations.store';
import { ReservationApi } from '../../../core/api/reservation.api';
import { Id } from '../../../core/model/common.model';
import { DateTime } from 'luxon';
import {
  Reservation,
  ReservationQueryModel,
  Reservations,
  SortBy,
  SortOrder,
} from '../../../core/model/reservation.model';
import { concatMap, EMPTY, filter, finalize, tap, withLatestFrom } from 'rxjs';
import { ToastKeys } from '../../../core/translation-keys';
import { ToastService } from '../../../core/service/toast.service';
import { RouterQuery } from '../../../core/state/router/router.query';
import { map } from 'rxjs/operators';
import { ReservationsQuery } from './reservations.query';
import { ParkingLotQuery } from '../parking-lot/parking-lot.query';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(
    private readonly store: ReservationsStore,
    private readonly api: ReservationApi,
    private readonly toastService: ToastService,
    private readonly query: ReservationsQuery,
    private readonly routerQuery: RouterQuery,
    private readonly parkingLotQuery: ParkingLotQuery,
  ) {}

  loadForDriver(driverId: Id) {
    return this.load({ driverId, onlyHistory: true });
  }

  reloadOnPagingChange$(driverId?: Id) {
    return this.routerQuery.queryParams$().pipe(
      withLatestFrom(this.routerQuery.reservationId$()),
      filter(([queryParams, reservationId]) => {
        return !reservationId && !!Object.keys(queryParams).length;
      }),
      tap(() => this.store.setLoading(true)),
      concatMap(([{ page, pageSize, sortOrder, sortBy }]) =>
        this.load({
          driverId,
          page: +page,
          pageSize: +pageSize,
          sortOrder: sortOrder as SortOrder,
          sortBy: sortBy as SortBy,
          onlyHistory: true,
        }),
      ),
    );
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
    const { approvalDeadLine } = reservation;
    return (
      approvalDeadLine && ReservationsService.isNowBefore(approvalDeadLine)
    );
  }

  canBeConfirmed(reservation: Reservation) {
    const { approvalTimeStart, approvalDeadLine } = reservation;
    return (
      approvalTimeStart &&
      ReservationsService.isNowAfter(approvalTimeStart) &&
      approvalDeadLine &&
      ReservationsService.isNowBefore(approvalDeadLine)
    );
  }

  canBeCancelled(reservation: Reservation) {
    const { startTime } = reservation;
    return ReservationsService.isNowBefore(startTime);
  }

  confirmReservation({ id }: Reservation) {
    return this.api
      .confirmReservation(id)
      .pipe(tap(() => this.toastService.show(ToastKeys.RESERVATION_CONFIRMED)));
  }

  cancelReservation({ id }: Reservation) {
    return this.api
      .cancelReservation(id)
      .pipe(tap(() => this.toastService.show(ToastKeys.RESERVATION_CANCELLED)));
  }

  changeTime(data: {
    reservation: Reservation;
    hours: { hourFrom: number; hourTo: number };
    date: Date;
  }) {
    const {
      reservation: { id },
      hours: { hourFrom, hourTo },
      date,
    } = data;
    const newDate = DateTime.fromJSDate(date);
    const start = ReservationsService.fullHour(newDate, hourFrom);
    const end = ReservationsService.fullHour(newDate, hourTo);
    this.store.setLoading(true);
    return this.api
      .changeTime({
        reservationId: id,
        start,
        end,
      })
      .pipe(
        tap(() => this.toastService.show(ToastKeys.RESERVATION_TIME_CHANGED)),
        finalize(() => this.store.setLoading(false)),
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

  hoursOf(reservation: Reservation) {
    const { startTime, endTime } = reservation;
    const hour = (h: string) => DateTime.fromISO(h).hour;
    return {
      hourFrom: hour(startTime),
      hourTo: hour(endTime),
    };
  }

  dateValidator(parkingLotId: Id) {
    const parkingLot = this.parkingLotQuery.getEntity(parkingLotId);
    return (date: Date | null): boolean => {
      if (!date || !parkingLot) return false;
      const dateTime = DateTime.fromJSDate(date);
      return (
        parkingLot.days.includes(dateTime.weekday - 1) &&
        dateTime.diffNow('days').as('days') >= 1
      );
    };
  }

  private load(query?: ReservationQueryModel) {
    return this.api
      .getReservations(query)
      .pipe(map(data => this.fillStoreWith(data)));
  }

  private fillStoreWith({ data, ...paging }: Reservations) {
    this.store.set(data);
    this.store.update(state => ({
      ...state,
      ...paging,
    }));
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

  static isNowBefore(date: string) {
    return (
      DateTime.fromISO(date)
        .diffNow('seconds')
        .as('seconds') > 0
    );
  }

  static isNowAfter(date: string) {
    return (
      DateTime.fromISO(date)
        .diffNow('seconds')
        .as('seconds') < 0
    );
  }
}
