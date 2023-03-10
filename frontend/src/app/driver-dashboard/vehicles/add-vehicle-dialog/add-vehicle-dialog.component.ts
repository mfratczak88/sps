import { Component, Inject } from '@angular/core';
import { DriverKeys, MiscKeys } from '../../../core/translation-keys';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Driver } from '../../../core/model/driver.model';
import { FormControl, ValidationErrors, Validator } from '@angular/forms';
import {
  LocalizedErrors,
  LocalizedValidators,
} from '../../../shared/validator';

@Component({
  selector: 'sps-add-vehicle-dialog',
  templateUrl: './add-vehicle-dialog.component.html',
  styleUrls: ['./add-vehicle-dialog.component.scss'],
})
export class AddVehicleDialogComponent implements Validator {
  translations = { ...DriverKeys, ...MiscKeys };

  existingLicensePlates: string[] = [];

  input: FormControl;

  constructor(
    readonly dialogRef: MatDialogRef<AddVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly driver: Driver,
  ) {
    this.existingLicensePlates = driver.vehicles.map((v) => v.licensePlate);
    this.input = new FormControl<string | null>(null, [
      LocalizedValidators.required,
      () => this.validate(),
    ]);
  }

  onAdd() {
    this.dialogRef.close(this.input.value);
  }

  validate(): ValidationErrors | null {
    if (this.existingLicensePlates.includes(this.input?.value)) {
      return LocalizedErrors.licensePlateAlreadyExist();
    }
    return null;
  }
}
