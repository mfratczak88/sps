import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { first, Observable } from 'rxjs';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';
import { ParkingLot } from '../../../core/model/admin.model';

@Component({
  selector: 'sps-assign-parking-lot-dialog',
  templateUrl: './assign-parking-lot-dialog.component.html',
  styleUrls: ['./assign-parking-lot-dialog.component.scss'],
})
export class AssignParkingLotDialogComponent {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  selectedLot = new FormControl(null, [LocalizedValidators.required]);

  lots: ParkingLot[] = [];

  constructor(
    readonly dialogRef: MatDialogRef<AssignParkingLotDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: Observable<ParkingLot[]>,
  ) {
    this.data.pipe(first()).subscribe(lots => {
      this.lots = lots;
    });
  }

  onAssign() {
    this.dialogRef.close(this.selectedLot.value);
  }
}
