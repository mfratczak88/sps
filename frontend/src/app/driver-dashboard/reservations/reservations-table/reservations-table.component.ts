import { Component, Input, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../../../core/model/reservation.model';

import { Column } from '../../../shared/components/table/table.component';
import { TableKeys } from '../../../core/translation-keys';
import { map } from 'rxjs/operators';
import { AddressPipe } from '../../../shared/pipe/address.pipe';
import { TimePipe } from '../../../shared/pipe/time.pipe';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterService } from '../../../core/state/router/router.service';
import { RouterQuery } from '../../../core/state/router/router.query';

@Component({
  selector: 'sps-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.scss'],
})
export class ReservationsTableComponent {
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    paginator?.page.subscribe(({ pageIndex, pageSize }) => {
      this.routerService.changeQueryParams({
        page: `${pageIndex + 1}`,
        pageSize: String(pageSize),
      });
    });
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    sort?.sortChange.subscribe(({ active, direction }) => {
      this.routerService.changeQueryParams({
        page: '1',
        sortBy: direction ? active : '',
        sortOrder: direction,
      });
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
    readonly routerService: RouterService,
    readonly routerQuery: RouterQuery,
  ) {}

  private derivedData(reservation: Reservation) {
    const { startTime, endTime, date } = reservation;

    const time = `${this.timePipe.transformTime(
      startTime,
    )} - ${this.timePipe.transformTime(endTime)}`;
    const parkingLotAddress = this.addressPipe.transform(reservation);

    return {
      time,
      date: this.timePipe.transformDate(date),
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
