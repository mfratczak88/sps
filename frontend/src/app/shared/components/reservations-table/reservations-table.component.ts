import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reservation } from '../../../core/model/reservation.model';
import { DriverReservation } from '../../../core/model/driver.model';
import { Button, Column } from '../table/table.component';
import { TableKeys } from '../../../core/translation-keys';
import { map } from 'rxjs/operators';
import { AddressPipe } from '../../pipe/address.pipe';
import { TimePipe } from '../../pipe/time.pipe';

@Component({
  selector: 'sps-reservations-table',
  templateUrl: './reservations-table.component.html',
  styleUrls: ['./reservations-table.component.scss'],
})
export class ReservationsTableComponent implements OnInit {
  translations = { ...TableKeys };

  @Input()
  reservations$: Observable<(Reservation | DriverReservation)[]> = of([]);

  @Input()
  loading$: Observable<boolean>;

  @Input()
  displayColumns: ReservationColumnName[] = [];

  @Input()
  buttons: Button[] = [];

  @Input()
  tableColumns: Column[] = [
    { name: 'createdAt', translation: this.translations.CREATED_AT },
    { name: 'licensePlate', translation: this.translations.LICENSE_PLATE },
    { name: 'time', translation: this.translations.TIME },
    {
      name: 'reservationDate',
      translation: this.translations.RESERVATION_DATE,
    },
    { name: 'status', translation: this.translations.RESERVATION_STATUS },
    {
      name: 'parkingLotAddress',
      translation: this.translations.PARKING_LOT_ADDRESS,
    },
  ];

  constructor(
    private readonly addressPipe: AddressPipe,
    private readonly timePipe: TimePipe,
  ) {}

  ngOnInit(): void {
    this.tableColumns = this.tableColumns.filter(col =>
      this.displayColumns.includes(col.name as ReservationColumnName),
    );
  }

  tableData$() {
    return this.reservations$.pipe(
      map(reservations =>
        reservations.map(reservation => {
          const parkingLot = (<DriverReservation>reservation).parkingLot;
          return {
            ...reservation,
            reservationDate: this.timePipe.transformDate(reservation.startTime),
            time:
              this.timePipe.transformTime(reservation.startTime) +
              '-' +
              this.timePipe.transformTime(reservation.endTime),
            parkingLotAddress:
              parkingLot && this.addressPipe.transform(parkingLot),
          };
        }),
      ),
    );
  }
}

export type ReservationColumnName =
  | 'createdAt'
  | 'licensePlate'
  | 'time'
  | 'reservationDate'
  | 'status'
  | 'parkingLotAddress';
