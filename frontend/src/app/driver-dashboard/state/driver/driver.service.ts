import { DriverStore } from './driver.store';
import { AuthQuery } from '../../../core/state/auth/auth.query';
import { DriversApi } from '../../../core/api/drivers.api';
import { combineLatest, concatMap, filter, finalize, NEVER, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Driver, TimeHorizon } from '../../../core/model/driver.model';
import { ToastService } from '../../../core/service/toast.service';
import { ToastKeys } from '../../../core/translation-keys';
import { ParkingLotQuery } from '../parking-lot/parking-lot.query';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { ReservationsService } from '../reservation/reservations.service';
import { DriverQuery } from './driver.query';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(
    private readonly store: DriverStore,
    private readonly driverApi: DriversApi,
    private readonly reservationsService: ReservationsService,
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
        tap(auth => auth && this.reservationsService.loadForDriver(auth.id)),
        concatMap(auth =>
          auth
            ? combineLatest([
                this.driverApi.getById(auth.id, {
                  timeHorizon: [
                    TimeHorizon.DUE_NEXT,
                    TimeHorizon.ONGOING,
                    TimeHorizon.PENDING_ACTION,
                  ],
                }),
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

  private fillStoreWith(driver: Driver, parkingLots: ParkingLot[]) {
    const { parkingLotIds, timeHorizon, ...driverData } = driver;
    const { ongoing, pendingAction, dueNext } = timeHorizon ?? {};
    this.store._setState({
      ...driverData,
      ongoing: ongoing || [],
      pendingAction: pendingAction || [],
      dueNext: dueNext || [],
      parkingLots: parkingLots.filter(lot =>
        parkingLotIds.find(id => lot.id === id),
      ),
    });
  }
}
