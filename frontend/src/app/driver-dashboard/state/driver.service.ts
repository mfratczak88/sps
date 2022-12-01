import { DriverStore } from './driver.store';
import { AuthQuery } from '../../core/state/auth/auth.query';
import { DriversApi } from '../../core/api/drivers.api';
import { concatMap, filter, finalize, NEVER, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Driver, Vehicle } from '../../core/model/driver.model';
import { ToastService } from '../../core/service/toast.service';
import { ToastKeys } from '../../core/translation-keys';
import { DateTime } from 'luxon';
import { ReservationApi } from '../../core/api/reservation.api';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(
    private readonly store: DriverStore,
    private readonly driverApi: DriversApi,
    private readonly reservationApi: ReservationApi,
    private readonly authQuery: AuthQuery,
    private readonly toastService: ToastService,
  ) {
    this.init();
  }

  init() {
    this.authQuery
      .select()
      .pipe(
        filter(auth => !!auth?.id),
        tap(() => this.store.setLoading(true)),
        concatMap(auth => (auth ? this.driverApi.getById(auth.id) : NEVER)),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe(driver => this.store._setState(driver));
  }

  addVehicle(vehicle: Vehicle, driver: Driver) {
    const { licensePlate, id } = { ...vehicle, ...driver };
    return this.driverApi.addVehicle(licensePlate, id).pipe(
      tap(() => this.init()),
      tap(() => this.toastService.show(ToastKeys.VEHICLE_ADDED)),
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
    const start = DriverService.fullHour(reservationDate, hourFrom).toJSDate();
    const end = DriverService.fullHour(reservationDate, hourTo).toJSDate();
    this.store.setLoading(true);
    return this.reservationApi
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
    return dateTime.set({
      hour: hour,
      second: 0,
      minute: 0,
      millisecond: 0,
    });
  }
}
