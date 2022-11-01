import { Component, OnInit } from '@angular/core';
import { DriversQuery } from '../state/drivers.query';
import { DriversService } from '../state/drivers.service';
import { RouterQuery } from '../../../core/state/router/router.query';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { concatMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AssignParkingLotDialogComponent } from '../assign-parking-lot-dialog/assign-parking-lot-dialog.component';
import { filter } from 'rxjs';

@Component({
  selector: 'sps-driver-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DriverDetailsComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  readonly driverParkingLots$ = this.driversQuery.active$.pipe(
    map(driver => driver?.parkingLots),
  );

  constructor(
    readonly driversQuery: DriversQuery,
    private readonly driversService: DriversService,
    private readonly routerQuery: RouterQuery,
    readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.driversService.select(this.routerQuery.driverId());
  }

  onAssignParkingLot(driverId: string) {
    const dialogRef = this.dialog.open(AssignParkingLotDialogComponent, {
      data: this.driversQuery.driverUnAssignedParkingLots$,
    });
    dialogRef
      .afterClosed()
      .pipe(filter(lotId => !!lotId))
      .pipe(
        concatMap(lotId =>
          this.driversService.assignParkingLot(driverId, lotId),
        ),
      )
      .subscribe();
  }
}
