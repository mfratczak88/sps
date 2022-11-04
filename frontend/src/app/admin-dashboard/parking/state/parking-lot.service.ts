import { Injectable } from '@angular/core';
import { ParkingLotApi } from './parking-lot.api';
import { finalize, first, tap } from 'rxjs';
import { ParkingLotStore } from './parking-lot.store';
import {
  ChangeHoursOfOperations,
  CreateParkingLot,
} from '../../../core/model/parking-lot.model';
import { ToastService } from '../../../core/service/toast.service';
import { RouterService } from '../../../core/state/router/router.service';
import { ToastKeys } from '../../../core/translation-keys';

@Injectable({
  providedIn: 'root',
})
export class ParkingLotService {
  constructor(
    private readonly api: ParkingLotApi,
    private readonly store: ParkingLotStore,
    private readonly toastService: ToastService,
    private readonly routerService: RouterService,
  ) {}

  load() {
    this.load$().subscribe();
  }

  private load$() {
    return this.api.getAll().pipe(
      tap(() => this.store.setLoading(true)),
      tap(lots => this.store.set(lots)),
      first(),
      finalize(() => this.store.setLoading(false)),
    );
  }

  changeOperationHours(hours: ChangeHoursOfOperations, lotId: string) {
    return this.api.changeHours(hours, lotId).pipe(
      tap(() => this.load()),
      tap(() => this.toastService.show(ToastKeys.HOURS_CHANGED)),
    );
  }

  changeCapacity(newCapacity: number, lotId: string) {
    return this.api.changeCapacity(newCapacity, lotId).pipe(
      tap(() => this.load()),
      tap(() => this.toastService.show(ToastKeys.CAPACITY_CHANGED)),
    );
  }

  createParkingLot(data: CreateParkingLot) {
    return this.api.create(data).pipe(
      tap(() => this.load()),
      tap(() => this.toastService.show(ToastKeys.PARKING_LOT_CREATED)),
    );
  }

  select(id: string) {
    if (!this.store.getValue().ids?.includes(id)) {
      return this.load$()
        .pipe(
          tap(lots => {
            if (!lots.find(l => l.id === id)) {
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
}
