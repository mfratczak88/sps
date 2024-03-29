import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { filter, first } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ParkingLot } from 'src/app/core/model/parking-lot.model';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import {
  assignedParkingLots,
  currentDriver,
  loading,
  unAssignedParkingLots,
} from '../../../core/store/drivers/drivers.selectors';
import { driverId } from '../../../core/store/routing/routing.selector';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { Button } from '../../../shared/components/table/table.component';
import { AssignParkingLotDialogComponent } from '../assign-parking-lot-dialog/assign-parking-lot-dialog.component';

@Component({
  selector: 'sps-driver-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DriverDetailsComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  readonly driver$ = this.store.select(currentDriver);

  readonly unAssignedParkingLots$ = this.store.select(unAssignedParkingLots);

  readonly assignedParkingLots$ = this.store.select(assignedParkingLots);

  readonly loading$ = this.store.select(loading);

  readonly parkingLotsTableButtons: Button[] = [
    {
      name: 'remove',
      translation: this.translations.REMOVE_ASSIGNMENT,
      icon: 'delete',
      onClick: ({ id: parkingLotId }: ParkingLot) =>
        this.onRemoveParkingLotAssignment(parkingLotId),
    },
  ];

  constructor(readonly store: Store, readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(
      new AdminActions.GetDriverDetails(this.store.selectSnapshot(driverId)),
    );
  }

  onAssignParkingLot(driverId: string) {
    const dialogRef = this.dialog.open(AssignParkingLotDialogComponent, {
      data: this.store.selectSnapshot(unAssignedParkingLots),
    });
    dialogRef
      .afterClosed()
      .pipe(filter((lotId) => !!lotId))
      .pipe(
        concatMap((lotId) =>
          this.store.dispatch(
            new AdminActions.AssignParkingLot(driverId, lotId),
          ),
        ),
        first(),
      )
      .subscribe();
  }

  onRemoveParkingLotAssignment(parkingLotId: string) {
    const { id } = this.store.selectSnapshot(currentDriver) || {};
    id &&
      this.store.dispatch(
        new AdminActions.RemoveParkingLotAssignment(id, parkingLotId),
      );
  }
}
