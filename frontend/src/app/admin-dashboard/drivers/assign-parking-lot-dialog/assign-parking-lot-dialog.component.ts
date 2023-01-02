import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { ParkingLot } from '../../../core/model/parking-lot.model';

@Component({
  selector: 'sps-assign-parking-lot-dialog',
  templateUrl: './assign-parking-lot-dialog.component.html',
  styleUrls: ['./assign-parking-lot-dialog.component.scss'],
})
export class AssignParkingLotDialogComponent {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  selectedLot = new FormControl(null, [LocalizedValidators.required]);

  constructor(
    readonly dialogRef: MatDialogRef<AssignParkingLotDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    readonly lots: ParkingLot[],
  ) {}

  onAssign() {
    this.dialogRef.close(this.selectedLot.value);
  }
}
