import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DriverKeys, MiscKeys } from '../../core/translation-keys';
import { Select, Store } from '@ngxs/store';
import { DriversState } from '../../core/store/drivers.state';
import { concatMap, filter, Observable } from 'rxjs';
import { Vehicle } from '../../core/model/driver.model';
import { AddVehicleDialogComponent } from './add-vehicle-dialog/add-vehicle-dialog.component';
import { DriverActions } from '../../core/store/actions/driver.actions';

@Component({
  selector: 'sps-driver-vehicles',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class VehiclesComponent {
  translations = { ...DriverKeys, ...MiscKeys };

  @Select(DriversState.vehicles)
  vehicles$: Observable<Vehicle[]>;

  @Select(DriversState.loading)
  loading$: Observable<boolean>;

  constructor(readonly store: Store, private readonly matDialog: MatDialog) {}

  onAddNewVehicle() {
    const driver = this.store.selectSnapshot(DriversState.currentDriver);
    if (!driver) return;

    const dialogRef = this.matDialog.open(AddVehicleDialogComponent, {
      data: driver,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(licensePlate => !!licensePlate),
        concatMap(licensePlate => {
          return this.store.dispatch(
            new DriverActions.AddVehicle(licensePlate),
          );
        }),
      )
      .subscribe();
  }
}
