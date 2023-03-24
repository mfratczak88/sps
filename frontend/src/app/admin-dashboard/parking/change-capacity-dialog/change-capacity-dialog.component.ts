import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { LocalizedValidators } from '../../../shared/validator';

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

  capacityNotChanged() {
    return +(this.capacity.value || 0) === this.data.capacity;
  }
}
