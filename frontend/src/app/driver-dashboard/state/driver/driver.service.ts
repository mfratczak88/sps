import { DriverStore } from './driver.store';
import { AuthQuery } from '../../../core/state/auth/auth.query';
import { DriversApi } from '../../../core/api/drivers.api';
import { combineLatest, concatMap, filter, finalize, NEVER, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Driver, DriverReservations } from '../../../core/model/driver.model';
import { ToastService } from '../../../core/service/toast.service';
import { ToastKeys } from '../../../core/translation-keys';
import { DateTime } from 'luxon';
import { ReservationApi } from '../../../core/api/reservation.api';
import { Reservation } from '../../../core/model/reservation.model';
import { ParkingLotQuery } from '../parking-lot/parking-lot.query';
import { ParkingLot } from '../../../core/model/parking-lot.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(
    private readonly store: DriverStore,
    private readonly driverApi: DriversApi,
    private readonly reservationApi: ReservationApi,
    private readonly parkingLotQuery: ParkingLotQuery,
    private readonly authQuery: AuthQuery,
    private readonly toastService: ToastService,
  ) {}

  load() {
    this.authQuery
      .select()
      .pipe(
        filter(auth => !!auth?.id),
        tap(() => this.store.setLoading(true)),
        concatMap(auth =>
          auth
            ? combineLatest([
                this.driverApi.getById(auth.id),
                this.driverApi.getDriverReservations(auth.id),
                this.parkingLotQuery.selectAll(),
              ])
            : NEVER,
        ),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe(data => this.fillStoreWith(...data));
  }

  addVehicle(licensePlate: string, driverId: string) {
    return this.driverApi.addVehicle(licensePlate, driverId).pipe(
      tap(() => this.load()),
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
    const start = DriverService.fullHour(reservationDate, hourFrom);
    const end = DriverService.fullHour(reservationDate, hourTo);
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

  confirmReservation({ id }: Reservation) {
    return this.reservationApi.confirmReservation(id).pipe(
      tap(() => this.load()),
      tap(() => this.toastService.show(ToastKeys.RESERVATION_CONFIRMED)),
    );
  }

  cancelReservation({ id }: Reservation) {
    return this.reservationApi.cancelReservation(id).pipe(
      tap(() => this.load()),
      tap(() => this.toastService.show(ToastKeys.RESERVATION_CANCELLED)),
    );
  }

  private fillStoreWith(
    driver: Driver,
    reservations: DriverReservations,
    parkingLots: ParkingLot[],
  ) {
    const { parkingLotIds, ...driverData } = driver;
    this.store._setState({
      ...driverData,
      ...reservations,
      parkingLots: parkingLots.filter(lot =>
        parkingLotIds.find(id => lot.id === id),
      ),
    });
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
