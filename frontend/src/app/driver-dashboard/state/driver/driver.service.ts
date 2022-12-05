import { DriverStore } from './driver.store';
import { AuthQuery } from '../../../core/state/auth/auth.query';
import { DriversApi } from '../../../core/api/drivers.api';
import { combineLatest, concatMap, filter, finalize, NEVER, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Driver } from '../../../core/model/driver.model';
import { ToastService } from '../../../core/service/toast.service';
import { ToastKeys } from '../../../core/translation-keys';
import { DateTime } from 'luxon';
import { ReservationApi } from '../../../core/api/reservation.api';
import {
  Reservation,
  ReservationWithParkingLot,
} from '../../../core/model/reservation.model';
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
                this.loadReservations(auth.id),
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

  private loadReservations(driverId: string) {
    return this.reservationApi.getForDriver(driverId);
  }

  private fillStoreWith(
    driver: Driver,
    reservations: Reservation[],
    parkingLots: ParkingLot[],
  ) {
    const {
      reservationsPendingApprovalIds,
      parkingLotIds,
      ...driverData
    } = driver;
    const reservationsPendingApproval: ReservationWithParkingLot[] = [];
    const reservationsHistory: ReservationWithParkingLot[] = [];

    reservations.forEach(reservation => {
      const correspondingParkingLot = this.parkingLotQuery.getEntity(
        reservation.parkingLotId,
      )!;
      if (reservationsPendingApprovalIds.includes(reservation.id)) {
        reservationsPendingApproval.push({
          ...reservation,
          ...DriverService.expandReservationWithParkingLot(
            reservation,
            correspondingParkingLot,
          ),
        });
      } else {
        reservationsHistory.push({
          ...reservation,
          ...DriverService.expandReservationWithParkingLot(
            reservation,
            correspondingParkingLot,
          ),
        });
      }
    });
    this.store._setState({
      ...driverData,
      reservationsHistory,
      reservationsPendingApproval,
      parkingLots: parkingLots.filter(lot =>
        parkingLotIds.find(id => lot.id === id),
      ),
    });
  }

  private static expandReservationWithParkingLot(
    reservation: Reservation,
    parkingLot: ParkingLot,
  ): ReservationWithParkingLot {
    const { city, streetName, streetNumber } = parkingLot;
    return {
      ...reservation,
      parkingLot: {
        city,
        streetName,
        streetNumber,
      },
    };
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
