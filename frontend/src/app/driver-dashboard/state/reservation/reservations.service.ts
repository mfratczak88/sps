import { Injectable } from '@angular/core';
import { ReservationsStore } from './reservations.store';
import { ReservationApi } from '../../../core/api/reservation.api';
import { Id } from '../../../core/model/common.model';
import { DateTime } from 'luxon';
import { Reservation } from '../../../core/model/reservation.model';
import { concatMap, finalize, tap } from 'rxjs';
import { ToastKeys } from '../../../core/translation-keys';
import { ToastService } from '../../../core/service/toast.service';
import { DriverQuery } from '../driver/driver.query';
import { RouterQuery } from '../../../core/state/router/router.query';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(
    private readonly store: ReservationsStore,
    private readonly api: ReservationApi,
    private readonly toastService: ToastService,
    private readonly driverQuery: DriverQuery,
    private readonly routerQuery: RouterQuery,
  ) {}

  loadForDriver(driverId: Id) {
    this.routerQuery
      .queryParams$()
      .pipe(
        tap(() => this.store.setLoading(true)),
        map(({ page, pageSize }) => ({ page: +page, pageSize: +pageSize })),
        concatMap(({ page, pageSize }) =>
          this.api.getReservations({ driverId, page, pageSize }),
        ),
      )
      .subscribe(({ data, ...paging }) => {
        this.store.set(data);
        this.store.update(state => ({
          ...state,
          ...paging,
        }));
      });
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
