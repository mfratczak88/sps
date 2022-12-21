import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmActionDialogComponent,
  ConfirmDialogProps,
  ConfirmResult,
} from '../../shared/components/confirm-action-dialog/confirm-action-dialog.component';
import { filter, first, Observable } from 'rxjs';
import { Reservation } from '../../core/model/reservation.model';
import { DrawerKeys, DriverKeys, MiscKeys } from '../../core/translation-keys';
import { Store } from '@ngxs/store';
import { DriverActions } from '../../core/store/actions/driver.actions';
import { ReservationValidator } from '../../core/validators/reservation.validator';
import {
  DialogData,
  DialogOutput,
  EditTimeDialogComponent,
} from './edit-time-dialog/edit-time-dialog.component';
import { hoursOf } from '../../core/util';

export abstract class ReservationBaseComponent {
  readonly translations = { ...DriverKeys, ...MiscKeys, ...DrawerKeys };

  protected constructor(
    protected readonly store: Store,
    protected readonly dialog: MatDialog,
    protected readonly validator: ReservationValidator,
  ) {}

  onConfirmReservation({ id }: Reservation) {
    this.confirmWithDialog(
      {
        title: this.translations.CONFIRM_RESERVATION,
        subTitle: this.translations.CONFIRM_RESERVATION_QUESTION,
      },
      () => this.store.dispatch(new DriverActions.ConfirmReservation(id)),
    );
  }

  onCancelReservation({ id }: Reservation) {
    this.confirmWithDialog(
      {
        title: this.translations.CANCEL_RESERVATION,
        subTitle: this.translations.CANCEL_RESERVATION_QUESTION,
      },
      () => this.store.dispatch(new DriverActions.CancelReservation(id)),
    );
  }

  onEditReservation(reservation: Reservation) {
    const dialogRef = this.dialog.open<
      EditTimeDialogComponent,
      DialogData,
      DialogOutput
    >(EditTimeDialogComponent, {
      data: {
        hours: hoursOf(reservation),
        date: reservation.date,
        dateValidator: this.validator
          .dateFilterFn(reservation.parkingLotId)
          .bind(this),
      },
    });
    const { id } = reservation;
    dialogRef
      .afterClosed()
      .pipe(
        filter(d => !!d),
        first(),
      )
      .subscribe(dialogOutput => {
        const { date, hours } = dialogOutput as DialogOutput;
        this.store.dispatch(
          new DriverActions.ChangeTimeOfReservation(id, hours, date),
        );
      });
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
    return dialogRef
      .afterClosed()
      .pipe(
        first(),
        filter(result => !!result?.confirmed),
      )
      .subscribe(cb);
  }
}
