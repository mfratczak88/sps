import { Injectable, NgZone } from '@angular/core';
import { ToastService } from '../../core/service/toast.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class MaterialToastService implements ToastService {
  constructor(
    private readonly snackBarRef: MatSnackBar,
    private readonly ngZone: NgZone,
  ) {}

  show(text: string): void {
    this.ngZone.run(() => this.snackBarRef.open(text, 'Dismiss'));
  }
}
