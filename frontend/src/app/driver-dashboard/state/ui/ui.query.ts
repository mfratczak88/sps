import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { UiState, UiStore } from './ui.store';

@Injectable({
  providedIn: 'root',
})
export class UiQuery extends Query<UiState> {
  constructor(store: UiStore) {
    super(store);
  }

  page$() {
    return this.select().pipe(map(({ page }) => page));
  }
}
