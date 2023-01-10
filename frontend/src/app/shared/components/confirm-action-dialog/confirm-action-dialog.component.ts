import { Component, Inject } from '@angular/core';
import { MiscKeys } from '../../../core/translation-keys';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogProps } from '../../../core/abstract.dialog';

@Component({
  selector: 'sps-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.scss'],
})
export class ConfirmActionDialogComponent {
  translations = { ...MiscKeys };

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly props: ConfirmDialogProps,
    readonly dialogRef: MatDialogRef<ConfirmActionDialogComponent>,
  ) {}
}
