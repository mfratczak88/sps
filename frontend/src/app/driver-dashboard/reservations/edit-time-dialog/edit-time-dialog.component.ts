import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { Hours } from '../../../shared/components/hours-form/hours-form.component';
import { DriverKeys, MiscKeys } from '../../../core/translation-keys';
import { DateTime } from 'luxon';

@Component({
  selector: 'sps-edit-time-dialog',
  templateUrl: './edit-time-dialog.component.html',
  styleUrls: ['./edit-time-dialog.component.scss'],
})
export class EditTimeDialogComponent {
  translations = { ...DriverKeys, ...MiscKeys };

  form: FormGroup<EditTimeForm>;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: DialogData,
    formBuilder: FormBuilder,
    readonly dialogRef: MatDialogRef<EditTimeDialogComponent, DialogOutput>,
  ) {
    const { hours, date } = data;
    this.form = formBuilder.nonNullable.group({
      date: [DateTime.fromISO(date).toJSDate(), [LocalizedValidators.required]],
      hours: [hours, [LocalizedValidators.required]],
    });
  }

  onEdit() {
    const { hours, date } = this.form.value;
    hours &&
      date &&
      this.dialogRef.close({
        hours,
        date,
      });
  }
}

interface EditTimeForm {
  hours: FormControl<Hours>;
  date: FormControl<Date>;
}

export interface DialogData {
  hours: Hours;
  date: string;
  dateValidator: (d: Date | null) => boolean;
}

export interface DialogOutput {
  hours: Hours;
  date: Date;
}
