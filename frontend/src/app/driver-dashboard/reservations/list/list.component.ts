import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { takeWhile } from 'rxjs';
import { ReservationsService } from '../../state/reservation/reservations.service';
import { ReservationBaseComponent } from '../reservation.base.component';
import { RouterService } from '../../../core/state/router/router.service';
import { DriverQuery } from '../../state/driver/driver.query';
import { ReservationsQuery } from '../../state/reservation/reservations.query';

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
    readonly routerService: RouterService,
    readonly driverQuery: DriverQuery,
    readonly reservationsQuery: ReservationsQuery,
  ) {
    super(reservationsService, dialog);
    this.reservationsService
      .reloadOnPagingChange$({ forDriver: true })
      .pipe(takeWhile(() => this.alive))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
