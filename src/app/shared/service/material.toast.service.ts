import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from '../../core/service/toast.service';

@Injectable()
export class MaterialToastService implements ToastService {
  constructor(private _snackBar: MatSnackBar) {}

  show(text: string): void {
    this._snackBar.open(text, 'Dismiss');
  }
}
