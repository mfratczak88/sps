import { Component, Inject } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HoursOfOperation, ParkingLot } from '../../../core/model/admin.model';

@Component({
  selector: 'sps-change-hours-dialog',
  templateUrl: './change-hours-dialog.component.html',
  styleUrls: ['./change-hours-dialog.component.scss'],
})
export class ChangeHoursDialogComponent {
  translations = { ...AdminKeys, ...MiscKeys };

  initialHours: HoursOfOperation;

  form: FormGroup<{ hours: FormControl<HoursOfOperation> }>;

  constructor(
    readonly dialogRef: MatDialogRef<ChangeHoursDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: ParkingLot,
    private readonly fb: FormBuilder,
  ) {
    const { hourFrom, hourTo } = data;
    this.initialHours = { hourFrom, hourTo };
    this.form = this.fb.nonNullable.group({
      hours: [{ hourFrom, hourTo }],
    });
  }

  onChange() {
    const { hourFrom, hourTo } = this.form.controls.hours.value;
    this.dialogRef.close({
      hourFrom,
      hourTo,
    });
  }

  hoursNotChanged() {
    const { hourFrom, hourTo } = this.form.controls.hours.value;
    return (
      hourFrom === this.initialHours.hourFrom &&
      hourTo === this.initialHours.hourTo
    );
  }
}
