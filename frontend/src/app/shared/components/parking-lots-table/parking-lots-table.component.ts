import { Component, Input, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { Button, Column } from '../table/table.component';
import { ParkingLotAdminModel } from '../../../core/model/parking-lot.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressPipe } from '../../pipe/address.pipe';
import { HoursPipe } from '../../pipe/hours.pipe';
import { DaysPipe } from '../../pipe/days.pipe';

@Component({
  selector: 'sps-parking-lots-table',
  templateUrl: './parking-lots-table.component.html',
  styleUrls: ['./parking-lots-table.component.scss'],
})
export class ParkingLotsTableComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  @Input()
  parkingLots$: Observable<Partial<ParkingLotAdminModel>[]> = of([]);

  @Input()
  tableButtons: Button[];

  @Input()
  loading$: Observable<boolean>;

  @Input()
  displayColumns: ParkingLotTableColumnName[] = [];

  @Input()
  tableColumns: Column[] = [
    { name: 'address', translation: this.translations.COLUMN_ADDRESS },
    { name: 'capacity', translation: this.translations.CAPACITY },
    { name: 'hours', translation: this.translations.HOURS },
    { name: 'days', translation: this.translations.DAYS },
    { name: 'validFrom', translation: this.translations.VALID_FROM },
  ];

  constructor(
    private readonly addressPipe: AddressPipe,
    private readonly hoursPipe: HoursPipe,
    private readonly daysPipe: DaysPipe,
  ) {}

  ngOnInit(): void {
    this.tableColumns = this.tableColumns.filter(col =>
      this.displayColumns.includes(col.name as ParkingLotTableColumnName),
    );
  }

  tableData$() {
    return this.parkingLots$.pipe(
      map(parkingLots =>
        parkingLots.map(lot => ({
          ...lot,
          hours: this.hoursPipe.transform(lot),
          address: this.addressPipe.transform(lot),
          days: this.daysPipe.transform(lot),
        })),
      ),
    );
  }
}
export type ParkingLotTableColumnName =
  | 'address'
  | 'capacity'
  | 'hours'
  | 'days'
  | 'validFrom';
