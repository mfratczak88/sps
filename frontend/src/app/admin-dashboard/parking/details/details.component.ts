import { Component, OnInit } from '@angular/core';
import { ParkingLotQuery } from '../state/parking-lot.query';
import { ParkingLotService } from '../state/parking-lot.service';
import { RouterQuery } from '../../../core/state/router/router.query';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { MatDialog } from '@angular/material/dialog';

import { concatMap, filter, first } from 'rxjs';
import { ChangeHoursDialogComponent } from '../change-hours-dialog/change-hours-dialog.component';
import { ChangeCapacityDialogComponent } from '../change-capacity-dialog/change-capacity-dialog.component';
import { ParkingLot } from '../../../core/model/parking-lot.model';

@Component({
  selector: 'sps-parking-lot-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  constructor(
    readonly parkingLotQuery: ParkingLotQuery,
    private readonly parkingLotService: ParkingLotService,
    private readonly routerQuery: RouterQuery,
    readonly dialog: MatDialog,
  ) {}

  translations = { ...AdminKeys, ...MiscKeys };

  ngOnInit(): void {
    this.parkingLotService.select(this.routerQuery.parkingLotId());
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
        concatMap(hours =>
          this.parkingLotService.changeOperationHours(hours, lot.id),
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
          this.parkingLotService.changeCapacity(capacity, lot.id),
        ),
        first(),
      )
      .subscribe();
  }
}
