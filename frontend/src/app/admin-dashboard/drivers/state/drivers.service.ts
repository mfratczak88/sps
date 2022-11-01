import { Injectable } from '@angular/core';
import { DriversStore } from './drivers.store';
import { DriversApi } from './drivers.api';
import { finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  constructor(
    private readonly store: DriversStore,
    private readonly api: DriversApi,
  ) {}

  load() {
    this.api
      .getAll()
      .pipe(
        tap(() => this.store.setLoading(true)),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe(v => this.store.set(v));
  }
}
