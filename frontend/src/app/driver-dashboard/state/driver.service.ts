import { DriverStore } from './driver.store';
import { AuthQuery } from '../../core/state/auth/auth.query';
import { DriversApi } from '../../core/api/drivers.api';
import { concatMap, filter, NEVER, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { Driver, Vehicle } from '../../core/model/driver.model';
import { ToastService } from '../../core/service/toast.service';
import { ToastKeys } from '../../core/translation-keys';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  constructor(
    private readonly store: DriverStore,
    private readonly driverApi: DriversApi,
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
        concatMap(auth => (auth ? this.driverApi.getById(auth.id) : NEVER)),
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
}
