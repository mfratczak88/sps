import { Component, OnDestroy } from '@angular/core';
import { DriverQuery } from '../../state/driver/driver.query';
import { DriverKeys, MiscKeys } from '../../../core/translation-keys';
import { Reservation } from '../../../core/model/reservation.model';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmActionDialogComponent,
  ConfirmDialogProps,
  ConfirmResult,
} from '../../../shared/components/confirm-action-dialog/confirm-action-dialog.component';
import { concatMap, first, NEVER, Observable, takeWhile } from 'rxjs';
import { RouterService } from '../../../core/state/router/router.service';
import { ReservationsService } from '../../state/reservation/reservations.service';
import { ReservationsQuery } from '../../state/reservation/reservations.query';

@Component({
  selector: 'sps-driver-reservation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationListComponent implements OnDestroy {
  translations = { ...DriverKeys, ...MiscKeys };

  alive = true;

  constructor(
    readonly driverQuery: DriverQuery,
    readonly reservationsQuery: ReservationsQuery,
    readonly reservationsService: ReservationsService,
    readonly routerService: RouterService,
    readonly dialog: MatDialog,
  ) {
    this.reservationsService
      .reloadOnPagingChange$({ forDriver: true })
      .pipe(takeWhile(() => this.alive))
      .subscribe();
  }

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

  ngOnDestroy(): void {
    this.alive = false;
  }

  private confirmWithDialog(
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
