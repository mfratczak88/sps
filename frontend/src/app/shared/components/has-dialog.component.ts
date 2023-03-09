import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogProps, ConfirmResult } from '../../core/abstract.dialog';
import { filter, first, Observable } from 'rxjs';
import { ConfirmActionDialogComponent } from './confirm-action-dialog/confirm-action-dialog.component';

export abstract class HasDialogComponent {
  protected constructor(protected readonly dialog: MatDialog) {}

  protected confirmWithDialog(
    data: ConfirmDialogProps,
    cb: () => Observable<void>,
  ) {
    const dialogRef = this.dialog.open<
      ConfirmActionDialogComponent,
      ConfirmDialogProps,
      ConfirmResult
    >(ConfirmActionDialogComponent, {
      data: {
        ...data,
      },
    });
    return dialogRef
      .afterClosed()
      .pipe(
        first(),
        filter((result) => !!result?.confirmed),
      )
      .subscribe(cb);
  }
}
