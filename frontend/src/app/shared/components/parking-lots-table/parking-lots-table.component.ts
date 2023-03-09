import { Component, Input } from '@angular/core';
import { AdminKeys, MiscKeys, TableKeys } from '../../../core/translation-keys';

import { map, Observable } from 'rxjs';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { AddressPipe } from '../../../core/pipe/address/address.pipe';
import { DaysPipe } from '../../../core/pipe/date/days.pipe';
import { HoursPipe } from '../../../core/pipe/time/hours.pipe';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'sps-parking-lots-table',
  templateUrl: '../table/table.component.html',
  styleUrls: [
    './parking-lots-table.component.scss',
    '../table/table.component.scss',
  ],
})
export class ParkingLotsTableComponent extends TableComponent {
  readonly parkingLotTranslations = { ...AdminKeys, ...MiscKeys, ...TableKeys };

  @Input()
  set parkingLots$(lots$: Observable<Partial<ParkingLot>[]>) {
    this.data = lots$?.pipe(
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

  @Input()
  set displayColumns(columns: ParkingLotTableColumnName[]) {
    this.columns = this.columns.filter(col =>
      columns.includes(col.name as ParkingLotTableColumnName),
    );
  }

  constructor(
    private readonly addressPipe: AddressPipe,
    private readonly hoursPipe: HoursPipe,
    private readonly daysPipe: DaysPipe,
  ) {
    super();
    this.columns = [
      {
        name: 'address',
        translation: this.parkingLotTranslations.COLUMN_ADDRESS,
      },
      { name: 'capacity', translation: this.parkingLotTranslations.CAPACITY },
      {
        name: 'validFrom',
        translation: this.parkingLotTranslations.VALID_FROM,
      },
      {
        name: 'timeOfOperation',
        translation: this.parkingLotTranslations.TIME_OF_OPERATION,
      },
    ];
  }
}
export type ParkingLotTableColumnName =
  | 'address'
  | 'capacity'
  | 'validFrom'
  | 'timeOfOperation';
