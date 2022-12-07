import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../../../core/model/reservation.model';
import { DriverReservation } from '../../../core/model/driver.model';
import {
  Button,
  Column,
} from '../../../shared/components/table/table.component';
import { TableKeys } from '../../../core/translation-keys';
import { map } from 'rxjs/operators';
import { AddressPipe } from '../../../shared/pipe/address.pipe';
import { TimePipe } from '../../../shared/pipe/time.pipe';
import { UiStore } from '../../state/ui/ui.store';
import { UiQuery } from '../../state/ui/ui.query';
import { SyncTableComponent } from '../../../shared/components/sync-table/sync-table.component';

@Component({
  selector: 'sps-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.scss'],
})
export class ReservationsTableComponent extends SyncTableComponent {
  reservationsTranslations = { ...TableKeys };

  @Input()
  reservations$: Observable<(Reservation | DriverReservation)[]> = of([]);

  @Input()
  set displayColumns(columns: ReservationColumnName[]) {
    this.tableColumns = this.tableColumns.filter(col =>
      columns.includes(col.name as ReservationColumnName),
    );
  }

  tableColumns: Column[] = [
    {
      name: 'createdAt',
      translation: this.reservationsTranslations.CREATED_AT,
    },
    {
      name: 'licensePlate',
      translation: this.reservationsTranslations.LICENSE_PLATE,
    },
    { name: 'time', translation: this.reservationsTranslations.TIME },
    {
      name: 'reservationDate',
      translation: this.reservationsTranslations.RESERVATION_DATE,
    },
    {
      name: 'status',
      translation: this.reservationsTranslations.RESERVATION_STATUS,
    },
    {
      name: 'parkingLotAddress',
      translation: this.reservationsTranslations.PARKING_LOT_ADDRESS,
    },
  ];

  constructor(
    private readonly addressPipe: AddressPipe,
    private readonly timePipe: TimePipe,
    readonly query: UiQuery,
    readonly store: UiStore,
  ) {
    super();
  }

  tableData$() {
    return this.reservations$.pipe(
      map(reservations =>
        reservations.map(reservation => {
          return {
            ...reservation,
            ...this.derivedData(reservation),
          };
        }),
      ),
    );
  }

  private derivedData(reservation: Reservation | DriverReservation) {
    const { startTime, endTime } = reservation;

    const time = `${this.timePipe.transformTime(
      startTime,
    )} - ${this.timePipe.transformTime(endTime)}`;

    const reservationDate = this.timePipe.transformDate(startTime);

    const { parkingLot } = <DriverReservation>reservation;
    const parkingLotAddress = parkingLot
      ? this.addressPipe.transform(parkingLot)
      : '';
    return {
      time,
      reservationDate,
      parkingLotAddress,
    };
  }
}

export type ReservationColumnName =
  | 'createdAt'
  | 'licensePlate'
  | 'time'
  | 'reservationDate'
  | 'status'
  | 'parkingLotAddress';
