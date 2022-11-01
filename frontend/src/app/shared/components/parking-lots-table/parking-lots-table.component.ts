import { Component, Input, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { Button, Column } from '../table/table.component';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sps-parking-lots-table',
  templateUrl: './parking-lots-table.component.html',
  styleUrls: ['./parking-lots-table.component.scss'],
})
export class ParkingLotsTableComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  @Input()
  parkingLots$: Observable<Partial<ParkingLot>[]> = of([]);

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
  ];

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
          hours: `${lot.hourFrom} - ${lot.hourTo}`,
          address: `${lot.streetName} ${lot.streetNumber}, ${lot.city}`,
        })),
      ),
    );
  }
}
export type ParkingLotTableColumnName = 'address' | 'capacity' | 'hours';
