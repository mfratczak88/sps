import { Injectable } from '@angular/core';
import { ParkingLotStore } from './parking-lot.store';
import { ParkingLotApi } from '../../../core/api/parking-lot.api';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParkingLotService {
  constructor(
    private readonly store: ParkingLotStore,
    private readonly api: ParkingLotApi,
  ) {}

  load() {
    this.api
      .getAll()
      .pipe(first())
      .subscribe(lots => this.store.set(lots));
  }
}
