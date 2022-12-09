import { ReservationsService } from '../state/reservation/reservations.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmActionDialogComponent,
  ConfirmDialogProps,
  ConfirmResult,
} from '../../shared/components/confirm-action-dialog/confirm-action-dialog.component';
import { concatMap, first, NEVER, Observable } from 'rxjs';
import { Reservation } from '../../core/model/reservation.model';
import { DrawerKeys, DriverKeys, MiscKeys } from '../../core/translation-keys';

export abstract class ReservationBaseComponent {
  readonly translations = { ...DriverKeys, ...MiscKeys, ...DrawerKeys };

  protected constructor(
    readonly reservationsService: ReservationsService,
    protected readonly dialog: MatDialog,
  ) {}

  onConfirmReservation(reservation: Reservation) {
    this.confirmWithDialog(
      {
        title: this.translations.CONFIRM_RESERVATION,
        subTitle: this.translations.CONFIRM_RESERVATION_QUESTION,
      },
      () => this.reservationsService.confirmReservation(reservation),
    );
  }

  onCancelReservation(reservation: Reservation) {
    this.confirmWithDialog(
      {
        title: this.translations.CANCEL_RESERVATION,
        subTitle: this.translations.CANCEL_RESERVATION_QUESTION,
      },
      () => this.reservationsService.cancelReservation(reservation),
    );
  }

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
    dialogRef
      .afterClosed()
      .pipe(
        first(),
        concatMap(result => (result?.confirmed ? cb() : NEVER)),
      )
      .subscribe();
  }
}
