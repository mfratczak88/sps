import { Component, OnInit } from '@angular/core';
import { ClerkKeys, DrawerKeys } from '../../core/translation-keys';
import { FormControl } from '@angular/forms';
import { LocalizedValidators } from '../../shared/validator';
import { reservationsListState } from '../../core/store/reservations/reservations.selector';
import {
  licensePlateFound,
  loading as licensePlatesLoading,
} from '../store/vehicles-search.selector';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClerkActions } from '../../core/store/actions/clerk.actions';
import { Id } from '../../core/model/common.model';
import { HasDialogComponent } from '../../shared/components/has-dialog.component';

@UntilDestroy()
@Component({
  selector: 'sps-operations',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class OperationsComponent extends HasDialogComponent implements OnInit {
  translations = { ...ClerkKeys, ...DrawerKeys };

  inputFormElement = new FormControl('', [LocalizedValidators.required]);

  licensePlatesLoading$ = this.store.select(licensePlatesLoading);

  searchResults$ = this.store.select(licensePlateFound);

  reservationsList = reservationsListState(this.store);

  constructor(dialog: MatDialog, private readonly store: Store) {
    super(dialog);
  }

  ngOnInit(): void {
    this.inputFormElement.valueChanges
      .pipe(untilDestroyed(this), debounceTime(400), distinctUntilChanged())
      .subscribe((licensePlate) =>
        licensePlate
          ? this.store.dispatch(
              new ClerkActions.SearchLicensePlates(licensePlate),
            )
          : this.store.dispatch(new ClerkActions.LicensePlateCleared()),
      );
  }

  onPageChanged(page: number) {
    this.store.dispatch(new ClerkActions.ReservationPageChanged(page));
  }

  onLicensePlateSelected(licensePlate: string) {
    this.store.dispatch(new ClerkActions.LicensePlateChosen(licensePlate));
  }

  onIssueTicket(reservationId: Id) {
    this.confirmWithDialog(
      {
        title: ClerkKeys.CONFIRM_TICKET_ISSUE,
        subTitle: ClerkKeys.CONFIRM_TICKET_ISSUE_QUESTION,
      },
      () =>
        this.store.dispatch(new ClerkActions.IssueParkingTicket(reservationId)),
    );
  }

  onReturnTicket(reservationId: Id) {
    this.confirmWithDialog(
      {
        title: ClerkKeys.CONFIRM_TICKET_RETURN,
        subTitle: ClerkKeys.CONFIRM_TICKET_RETURN_QUESTION,
      },
      () =>
        this.store.dispatch(
          new ClerkActions.ReturnParkingTicket(reservationId),
        ),
    );
  }
}
