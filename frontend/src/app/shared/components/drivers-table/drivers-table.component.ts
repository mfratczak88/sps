import { Component } from '@angular/core';
import { AdminKeys, MiscKeys } from 'src/app/core/translation-keys';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'sps-drivers-table',
  templateUrl: '../table/table.component.html',
  styleUrls: [
    './drivers-table.component.scss',
    '../table/table.component.scss',
  ],
})
export class DriversTableComponent extends TableComponent {
  readonly driverTranslations = { ...AdminKeys, ...MiscKeys };
  constructor() {
    super();
    this.columns = [
      { name: 'name', translation: this.driverTranslations.NAME },
      { name: 'email', translation: this.driverTranslations.EMAIL },
      {
        name: 'parkingLotCount',
        translation: this.driverTranslations.ASSIGNED_PARKING_LOTS,
      },
    ];
  }
}
