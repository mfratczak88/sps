import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParkingLotAdminModel } from '../../../core/model/parking-lot.model';
import { first, Observable } from 'rxjs';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../../shared/validator';

@Component({
  selector: 'sps-assign-parking-lot-dialog',
  templateUrl: './assign-parking-lot-dialog.component.html',
  styleUrls: ['./assign-parking-lot-dialog.component.scss'],
})
export class AssignParkingLotDialogComponent {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  selectedLot = new FormControl(null, [LocalizedValidators.required]);

  lots: ParkingLotAdminModel[] = [];

  constructor(
    readonly dialogRef: MatDialogRef<AssignParkingLotDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private readonly data: Observable<ParkingLotAdminModel[]>,
  ) {
    this.data.pipe(first()).subscribe(lots => {
      this.lots = lots;
    });
  }

  onAssign() {
    this.dialogRef.close(this.selectedLot.value);
  }
}
