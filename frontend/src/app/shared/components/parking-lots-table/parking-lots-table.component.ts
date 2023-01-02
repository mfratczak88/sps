import { Component, Input } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { Column } from '../table/table.component';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressPipe } from '../../pipe/address/address.pipe';
import { HoursPipe } from '../../pipe/time/hours.pipe';
import { DaysPipe } from '../../pipe/date/days.pipe';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { SyncTableComponent } from '../sync-table/sync-table.component';

@Component({
  selector: 'sps-parking-lots-table',
  templateUrl: './parking-lots-table.component.html',
  styleUrls: ['./parking-lots-table.component.scss'],
})
export class ParkingLotsTableComponent extends SyncTableComponent {
  readonly parkingLotTranslations = { ...AdminKeys, ...MiscKeys };

  @Input()
  parkingLots$: Observable<Partial<ParkingLot>[]> = of([]);

  @Input()
  set displayColumns(columns: ParkingLotTableColumnName[]) {
    this.tableColumns = this.tableColumns.filter(col =>
      columns.includes(col.name as ParkingLotTableColumnName),
    );
  }

  @Input()
  tableColumns: Column[] = [
    {
      name: 'address',
      translation: this.parkingLotTranslations.COLUMN_ADDRESS,
    },
    { name: 'capacity', translation: this.parkingLotTranslations.CAPACITY },
    { name: 'hours', translation: this.parkingLotTranslations.HOURS },
    { name: 'days', translation: this.parkingLotTranslations.DAYS },
    { name: 'validFrom', translation: this.parkingLotTranslations.VALID_FROM },
  ];

  constructor(
    private readonly addressPipe: AddressPipe,
    private readonly hoursPipe: HoursPipe,
    private readonly daysPipe: DaysPipe,
  ) {
    super();
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
