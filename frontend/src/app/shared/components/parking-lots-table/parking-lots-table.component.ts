import { Component, Input } from '@angular/core';
import { AdminKeys, MiscKeys, TableKeys } from '../../../core/translation-keys';
import { Column } from '../table/table.component';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { AddressPipe } from '../../../core/pipe/address/address.pipe';
import { DaysPipe } from '../../../core/pipe/date/days.pipe';
import { HoursPipe } from '../../../core/pipe/time/hours.pipe';
import { SyncTableComponent } from '../sync-table/sync-table.component';

@Component({
  selector: 'sps-parking-lots-table',
  templateUrl: './parking-lots-table.component.html',
  styleUrls: ['./parking-lots-table.component.scss'],
})
export class ParkingLotsTableComponent extends SyncTableComponent {
  readonly parkingLotTranslations = { ...AdminKeys, ...MiscKeys, ...TableKeys };

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
    { name: 'validFrom', translation: this.parkingLotTranslations.VALID_FROM },
    {
      name: 'timeOfOperation',
      translation: this.parkingLotTranslations.TIME_OF_OPERATION,
    },
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
          address: this.addressPipe.transform(lot),
          timeOfOperation: `${this.daysPipe.transform(
            lot,
          )}, ${this.hoursPipe.transform(lot)}`,
        })),
      ),
    );
  }
}
export type ParkingLotTableColumnName =
  | 'address'
  | 'capacity'
  | 'validFrom'
  | 'timeOfOperation';
