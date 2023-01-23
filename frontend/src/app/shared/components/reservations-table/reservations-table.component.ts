import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Paging,
  Reservation,
  ReservationStatusTranslationKey,
  SortBy,
  Sorting,
  SortOrder,
} from '../../../core/model/reservation.model';

import { Column } from '../table/table.component';
import { TableKeys } from '../../../core/translation-keys';
import { map } from 'rxjs/operators';
import { AddressPipe } from '../../../core/pipe/address/address.pipe';
import { SpsReservationTimePipe } from '../../../core/pipe/time/reservation-time';
import { Sort } from '@angular/material/sort';
import { Id } from '../../../core/model/common.model';
import { DatePipe } from '../../../core/pipe/date/date.pipe';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'sps-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.scss'],
})
export class ReservationsTableComponent {
  @Input()
  set reservations$(reservations: Observable<Reservation[]>) {
    reservations
      .pipe(
        untilDestroyed(this),
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

  @Input()
  sorting$: Observable<Sorting>;

  @Input()
  paging$: Observable<Paging>;

  @Output()
  reservationClicked = new EventEmitter<Id>();

  @Output()
  sortingChange = new EventEmitter<{
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  }>();

  @Output()
  pagingChange = new EventEmitter<{ page: number; pageSize: number }>();

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
    private readonly timePipe: SpsReservationTimePipe,
    private readonly datePipe: DatePipe,
  ) {}

  sortChange({ active, direction }: Sort) {
    const sortBy = (direction ? active : undefined) as SortBy;
    const sortOrder = direction as SortOrder;
    this.sortingChange.emit({ sortBy, sortOrder });
  }

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
