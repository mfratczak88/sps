import { Component, Inject } from '@angular/core';
import { MiscKeys } from '../../../core/translation-keys';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'sps-confirm-action-dialog',
  templateUrl: './confirm-action-dialog.component.html',
  styleUrls: ['./confirm-action-dialog.component.scss'],
})
export class ConfirmActionDialogComponent {
  translations = { ...MiscKeys };

  props: ConfirmDialogProps;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConfirmDialogProps,
    readonly dialogRef: MatDialogRef<ConfirmActionDialogComponent>,
  ) {
    this.props = data;
  }
}
export interface ConfirmDialogProps {
  title: string;
  subTitle: string;
}
export interface ConfirmResult {
  confirmed: boolean;
}
