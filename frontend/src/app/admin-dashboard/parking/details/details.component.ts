import { Component, OnInit } from '@angular/core';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { MatDialog } from '@angular/material/dialog';

import { concatMap, filter, first } from 'rxjs';
import { ChangeHoursDialogComponent } from '../change-hours-dialog/change-hours-dialog.component';
import { ChangeCapacityDialogComponent } from '../change-capacity-dialog/change-capacity-dialog.component';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { Store } from '@ngxs/store';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import { parkingLotId } from '../../../core/store/routing/routing.selector';
import {
  active,
  loading,
} from '../../../core/store/parking-lot/parking-lot.selectors';

@Component({
  selector: 'sps-parking-lot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  constructor(readonly store: Store, readonly dialog: MatDialog) {}

  translations = { ...AdminKeys, ...MiscKeys };

  loading$ = this.store.select(loading);

  parkingLot$ = this.store.select(active);

  ngOnInit(): void {
    this.store.dispatch(
      new AdminActions.GetParkingLot(this.store.selectSnapshot(parkingLotId)),
    );
  }

  onChangeHours(lot: ParkingLot) {
    const dialogRef = this.dialog.open(ChangeHoursDialogComponent, {
      data: lot,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(val => !!val),
        first(),
        concatMap(({ hourFrom, hourTo }) =>
          this.store.dispatch(
            new AdminActions.ChangeOperationHours(hourFrom, hourTo, lot.id),
          ),
        ),
      )
      .subscribe();
  }

  onChangeCapacity(lot: ParkingLot) {
    const dialogRef = this.dialog.open(ChangeCapacityDialogComponent, {
      data: lot,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(val => !!val),
        concatMap(capacity =>
          this.store.dispatch(
            new AdminActions.ChangeCapacity(capacity, lot.id),
          ),
        ),
        first(),
      )
      .subscribe();
  }
}
