import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { RouterService } from '../../../core/state/router/router.service';
import { RouterQuery } from '../../../core/state/router/router.query';
import { first } from 'rxjs';

export interface UiState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

const initialState: UiState = {
  page: 0,
  pageSize: 0,
  sortBy: '',
  sortOrder: '',
};

@StoreConfig({
  name: 'driver-ui',
})
@Injectable({
  providedIn: 'root',
})
export class UiStore extends Store<UiState> {
  constructor(
    private readonly routerService: RouterService,
    private readonly routerQuery: RouterQuery,
  ) {
    super(initialState);
    this.routerQuery
      .queryParams$()
      .pipe(first())
      .subscribe(({ page, sortOrder, sortBy, pageSize }) => {
        const { page: initialPage, pageSize: initialPageSize } = initialState;
        this._setState({
          sortBy,
          sortOrder,
          page: Number.isInteger(page) ? Number(page) : initialPage,
          pageSize: Number.isInteger(pageSize)
            ? Number(pageSize)
            : initialPageSize,
        });
      });
  }

  updateReservationPage(page: number) {
    this.update({
      page,
    });
    this.routerService.changePageQueryParam(page);
  }
}
