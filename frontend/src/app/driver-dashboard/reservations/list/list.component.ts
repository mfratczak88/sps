import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, takeWhile } from 'rxjs';
import { ReservationsService } from '../../state/reservation/reservations.service';
import { ReservationBaseComponent } from '../base.component';
import { RouterService } from '../../../core/state/router/router.service';
import { DriverQuery } from '../../state/driver/driver.query';
import { ReservationsQuery } from '../../state/reservation/reservations.query';
import { DriverService } from '../../state/driver/driver.service';

@Component({
  selector: 'sps-driver-reservation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ReservationListComponent extends ReservationBaseComponent
  implements OnDestroy {
  alive = true;

  constructor(
    reservationsService: ReservationsService,
    dialog: MatDialog,
    routerService: RouterService,
    readonly driverQuery: DriverQuery,
    readonly reservationsQuery: ReservationsQuery,
    readonly driverService: DriverService,
  ) {
    super(reservationsService, dialog, routerService);

    this.reload$
      .pipe(
        switchMap(() => this.driverService.loadReservations$()),
        takeWhile(() => this.alive),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
