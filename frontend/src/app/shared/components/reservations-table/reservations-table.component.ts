import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Reservation,
  ReservationStatusTranslationKey,
  SortBy,
  SortOrder,
} from '../../../core/model/reservation.model';

import { Column } from '../table/table.component';
import { TableKeys } from '../../../core/translation-keys';
import { map } from 'rxjs/operators';
import { AddressPipe } from '../../../core/pipe/address/address.pipe';
import { TimePipe } from '../../../core/pipe/time/time.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Id } from '../../../core/model/common.model';
import { DatePipe } from '../../../core/pipe/date/date.pipe';
import { Store } from '@ngxs/store';
import { DriverActions } from '../../../core/store/actions/driver.actions';
import {
  paging,
  sorting,
} from '../../../core/store/reservations/reservations.selector';

@Component({
  selector: 'sps-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.scss'],
})
export class ReservationsTableComponent {
  paging$ = this.store.select(paging);

  sorting$ = this.store.select(sorting);

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    paginator?.page.subscribe(({ pageIndex, pageSize }) => {
      this.store.dispatch(
        new DriverActions.PagingChange(pageIndex + 1, pageSize),
      );
    });
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    sort?.sortChange.subscribe(({ active, direction }) => {
      const sortBy = (direction ? active : undefined) as SortBy;
      const sortOrder = direction as SortOrder;
      this.store.dispatch(new DriverActions.SortingChange(sortBy, sortOrder));
    });
  }

  @Input()
  set reservations$(reservations: Observable<Reservation[]>) {
    reservations
      .pipe(
        map(reservations =>
          reservations.map(reservation => {
            return {
              ...reservation,
              ...this.derivedData(reservation),
            };
          }),
        ),
      )
      .subscribe(data => (this.data = data));
  }

  @Input()
  set displayColumns(columns: ReservationColumnName[]) {
    this.tableColumns = this.tableColumns.filter(col =>
      columns.includes(col.name as ReservationColumnName),
    );
    this.displayedColumns = columns;
  }

  @Input()
  loading$: Observable<boolean> = of(true);

  @Input()
  length$: Observable<number> = of(0);

  @Output()
  reservationClicked = new EventEmitter<Id>();

  reservationsTranslations = { ...TableKeys };

  data: unknown[] = [];

  displayedColumns: ReservationColumnName[] = [];

  tableColumns: Column[] = [
    {
      name: 'createdAt',
      translation: this.reservationsTranslations.CREATED_AT,
      sortable: true,
    },
    {
      name: 'licensePlate',
      translation: this.reservationsTranslations.LICENSE_PLATE,
    },
    { name: 'time', translation: this.reservationsTranslations.TIME },
    {
      name: 'date',
      translation: this.reservationsTranslations.RESERVATION_DATE,
      sortable: true,
    },
    {
      name: 'status',
      translation: this.reservationsTranslations.RESERVATION_STATUS,
      sortable: true,
    },
    {
      name: 'parkingLotAddress',
      translation: this.reservationsTranslations.PARKING_LOT_ADDRESS,
    },
  ];

  constructor(
    private readonly addressPipe: AddressPipe,
    private readonly timePipe: TimePipe,
    private readonly datePipe: DatePipe,
    private readonly store: Store,
  ) {}

  private derivedData(reservation: Reservation) {
    const { date, status } = reservation;

    const time = this.timePipe.transform(reservation);
    const parkingLotAddress = this.addressPipe.transform(reservation);

    return {
      time,
      date: this.datePipe.transform(date),
      status: ReservationStatusTranslationKey[status],
      parkingLotAddress,
    };
  }
}

export type ReservationColumnName =
  | 'createdAt'
  | 'licensePlate'
  | 'time'
  | 'date'
  | 'status'
  | 'parkingLotAddress';
