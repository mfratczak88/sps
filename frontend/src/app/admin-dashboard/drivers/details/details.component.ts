import { Component, OnInit } from '@angular/core';
import { DriversQuery } from '../state/drivers.query';
import { DriversService } from '../state/drivers.service';
import { RouterQuery } from '../../../core/state/router/router.query';
import { AdminKeys, MiscKeys } from '../../../core/translation-keys';
import { concatMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AssignParkingLotDialogComponent } from '../assign-parking-lot-dialog/assign-parking-lot-dialog.component';
import { filter, first } from 'rxjs';
import { Button } from '../../../shared/components/table/table.component';
import { ParkingLotAdminModel } from '../../../core/model/parking-lot.model';

@Component({
  selector: 'sps-driver-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DriverDetailsComponent implements OnInit {
  readonly translations = { ...AdminKeys, ...MiscKeys };

  readonly parkingLotsTableButtons: Button[] = [
    {
      name: 'remove',
      translation: this.translations.REMOVE_ASSIGNMENT,
      icon: 'delete',
      onClick: ({ id: parkingLotId }: ParkingLotAdminModel) =>
        this.onRemoveParkingLotAssignment(parkingLotId),
    },
  ];

  readonly driverParkingLots$ = this.driversQuery
    .active$()
    .pipe(map(driver => driver?.parkingLots));

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
      data: this.driversQuery.driverUnAssignedParkingLots$(),
    });
    dialogRef
      .afterClosed()
      .pipe(filter(lotId => !!lotId))
      .pipe(
        concatMap(lotId =>
          this.driversService.assignParkingLot(driverId, lotId),
        ),
        first(),
      )
      .subscribe();
  }

  onRemoveParkingLotAssignment(parkingLotId: string) {
    this.driversQuery
      .active$()
      .pipe(
        map(driver => driver.id),
        concatMap(driverId =>
          this.driversService.removeParkingLotAssignment({
            driverId,
            parkingLotId,
          }),
        ),
        first(),
      )
      .subscribe();
  }
}
