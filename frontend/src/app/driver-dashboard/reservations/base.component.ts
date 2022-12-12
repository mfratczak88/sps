import { ReservationsService } from '../state/reservation/reservations.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmActionDialogComponent,
  ConfirmDialogProps,
  ConfirmResult,
} from '../../shared/components/confirm-action-dialog/confirm-action-dialog.component';
import {
  BehaviorSubject,
  concatMap,
  first,
  NEVER,
  Observable,
  tap,
} from 'rxjs';
import { Reservation } from '../../core/model/reservation.model';
import { DrawerKeys, DriverKeys, MiscKeys } from '../../core/translation-keys';
import { RouterService } from '../../core/state/router/router.service';
import {
  DialogData,
  DialogOutput,
  EditTimeDialogComponent,
} from './edit-time-dialog/edit-time-dialog.component';

export abstract class ReservationBaseComponent {
  readonly translations = { ...DriverKeys, ...MiscKeys, ...DrawerKeys };

  protected readonly reload$ = new BehaviorSubject<boolean>(true);

  protected constructor(
    readonly reservationsService: ReservationsService,
    protected readonly dialog: MatDialog,
    readonly routerService: RouterService,
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

  onEditReservation(reservation: Reservation) {
    const dialogRef = this.dialog.open<
      EditTimeDialogComponent,
      DialogData,
      DialogOutput
    >(EditTimeDialogComponent, {
      data: {
        hours: this.reservationsService.hoursOf(reservation),
        date: reservation.date,
        dateValidator: this.reservationsService
          .dateValidator(reservation.parkingLotId)
          .bind(this),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        concatMap(data =>
          data
            ? this.reservationsService.changeTime({
                reservation,
                ...data,
              })
            : NEVER,
        ),
        tap(() => this.reload$.next(true)),
      )
      .subscribe();
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
        concatMap(result => (result?.confirmed ? cb() : NEVER)),
        tap(() => this.reload$.next(true)),
      )
      .subscribe();
  }
}
