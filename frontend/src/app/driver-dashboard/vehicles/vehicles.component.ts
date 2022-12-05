import { Component } from '@angular/core';
import { DriverQuery } from '../state/driver/driver.query';
import { DriverService } from '../state/driver/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';
import { concatMap, filter } from 'rxjs';
import { DriverKeys, MiscKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-driver-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss'],
})
export class VehiclesComponent {
  translations = { ...DriverKeys, ...MiscKeys };

  constructor(
    readonly driverQuery: DriverQuery,
    private readonly driverService: DriverService,
    private readonly matDialog: MatDialog,
  ) {}

  onAddNewVehicle() {
    const driver = this.driverQuery.getValue();
    const dialogRef = this.matDialog.open(AddVehicleDialogComponent, {
      data: driver,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(licensePlate => !!licensePlate),
        concatMap(licensePlate => {
          return this.driverService.addVehicle(licensePlate, driver.id);
        }),
      )
      .subscribe();
  }
}
