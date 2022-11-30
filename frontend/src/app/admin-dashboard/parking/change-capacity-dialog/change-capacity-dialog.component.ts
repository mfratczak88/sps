import { Component, Inject } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParkingLot } from '../../../core/model/admin.model';

@Component({
  selector: 'sps-change-capacity-dialog',
  templateUrl: './change-capacity-dialog.component.html',
  styleUrls: ['./change-capacity-dialog.component.scss'],
})
export class ChangeCapacityDialogComponent {
  translations = { ...AdminKeys, ...MiscKeys };

  capacity = new FormControl<number>(0, [LocalizedValidators.required]);

  constructor(
    readonly dialogRef: MatDialogRef<ChangeCapacityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: ParkingLot,
  ) {
    this.capacity.setValue(data.capacity);
  }

  onChange() {
    this.dialogRef.close(Number(this.capacity.value));
  }
}
