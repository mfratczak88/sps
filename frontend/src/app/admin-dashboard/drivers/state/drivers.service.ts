import { Injectable } from '@angular/core';
import { DriversStore } from './drivers.store';
import { DriversApi } from './drivers.api';
import { concatMap, finalize, tap } from 'rxjs';
import { RouterService } from '../../../core/state/router/router.service';
import { ParkingLotService } from '../../parking/state/parking-lot.service';
import { ToastService } from 'src/app/core/service/toast.service';
import { ToastKeys } from '../../../core/translation-keys';
import { RemoveParkingLotAssignment } from './drivers.model';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  constructor(
    private readonly store: DriversStore,
    private readonly api: DriversApi,
    private readonly parkingLotService: ParkingLotService,
    private readonly toastService: ToastService,
    private readonly routerService: RouterService,
  ) {}

  load() {
    this.load$().subscribe();
  }

  private load$() {
    return this.api.getAll().pipe(
      tap(() => this.store.setLoading(true)),
      finalize(() => this.store.setLoading(false)),
      tap(v =>
        this.store.set(
          v.map(driver => ({
            ...driver,
            parkingLotCount: driver.parkingLots.length,
          })),
        ),
      ),
    );
  }

  select(id: string) {
    this.parkingLotService.load();
    if (!this.store.getValue().ids?.includes(id)) {
      return this.load$()
        .pipe(
          tap(drivers => {
            if (!drivers.find(l => l.id === id)) {
              this.routerService.to404();
            } else {
              this.store.setActive(id);
            }
          }),
        )
        .subscribe();
    }
    return this.store.setActive(id);
  }

  assignParkingLot(driverId: string, parkingLotId: string) {
    return this.api.assignParkingLot({ driverId, parkingLotId }).pipe(
      tap(() => this.load$()),
      tap(() => this.toastService.show(ToastKeys.PARKING_LOT_ASSIGNED)),
    );
  }

  removeParkingLotAssignment(req: RemoveParkingLotAssignment) {
    return this.api.removeParkingLotAssignment(req).pipe(
      tap(() => this.load$()),
      tap(() =>
        this.toastService.show(ToastKeys.PARKING_LOT_ASSIGNMENT_REMOVED),
      ),
    );
  }
}
