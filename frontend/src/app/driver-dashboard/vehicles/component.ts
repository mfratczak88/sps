import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DriverKeys, MiscKeys } from '../../core/translation-keys';
import { Store } from '@ngxs/store';
import { concatMap, filter, Observable } from 'rxjs';
import { Vehicle } from '../../core/model/driver.model';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';
import { DriverActions } from '../../core/store/actions/driver.actions';
import {
  currentDriver,
  loading,
  vehicles,
} from '../../core/store/drivers/drivers.selectors';

@Component({
  selector: 'sps-driver-vehicles',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class VehiclesComponent {
  translations = { ...DriverKeys, ...MiscKeys };

  vehicles$: Observable<Vehicle[]> = this.store.select(vehicles);

  loading$: Observable<boolean> = this.store.select(loading);

  constructor(readonly store: Store, private readonly matDialog: MatDialog) {}

  onAddNewVehicle() {
    const driver = this.store.selectSnapshot(currentDriver);
    if (!driver) return;

    const dialogRef = this.matDialog.open(AddVehicleDialogComponent, {
      data: driver,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((licensePlate) => !!licensePlate),
        concatMap((licensePlate) => {
          return this.store.dispatch(
            new DriverActions.AddVehicle(licensePlate),
          );
        }),
      )
      .subscribe();
  }
}
