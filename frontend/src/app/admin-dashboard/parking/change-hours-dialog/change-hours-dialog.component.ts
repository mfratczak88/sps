import { Component, Inject } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParkingLot } from '../../../core/model/parking-lot.model';

@Component({
  selector: 'sps-change-hours-dialog',
  templateUrl: './change-hours-dialog.component.html',
  styleUrls: ['./change-hours-dialog.component.scss'],
})
export class ChangeHoursDialogComponent {
  translations = { ...AdminKeys, ...MiscKeys };

  initialHours: { hourFrom: string; hourTo: string };

  form = new FormGroup({
    hourFrom: new FormControl<string | null>(null, [
      LocalizedValidators.required,
    ]),
    hourTo: new FormControl<string | null>(null, [
      LocalizedValidators.required,
    ]),
  });

  constructor(
    readonly dialogRef: MatDialogRef<ChangeHoursDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: ParkingLot,
  ) {
    const { hourFrom, hourTo } = data;
    this.initialHours = {
      hourTo,
      hourFrom,
    };
    this.form.setValue({
      hourTo,
      hourFrom,
    });
  }

  onChange() {
    const { hourFrom, hourTo } = this.form.value;
    this.dialogRef.close({
      hourFrom,
      hourTo,
    });
  }

  hoursNotChanged() {
    const { hourFrom, hourTo } = this.form.value;
    return (
      hourFrom === this.initialHours.hourFrom &&
      hourTo === this.initialHours.hourTo
    );
  }
}
