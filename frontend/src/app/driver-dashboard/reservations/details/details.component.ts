import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReservationsService } from '../../state/reservation/reservations.service';
import { RouterQuery } from '../../../core/state/router/router.query';
import { concatMap } from 'rxjs/operators';
import { takeWhile } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ReservationBaseComponent } from '../reservation.base.component';
import { ReservationsQuery } from '../../state/reservation/reservations.query';
import { RouterService } from '../../../core/state/router/router.service';

@Component({
  selector: 'sps-reservation-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class ReservationDetailsComponent extends ReservationBaseComponent
  implements OnInit, OnDestroy {
  alive = true;

  constructor(
    service: ReservationsService,
    dialog: MatDialog,
    readonly routerQuery: RouterQuery,
    readonly query: ReservationsQuery,
    routerService: RouterService,
  ) {
    super(service, dialog, routerService);
  }

  ngOnInit(): void {
    this.routerQuery
      .reservationId$()
      .pipe(
        concatMap(id => this.reservationsService.select(id)),
        takeWhile(() => this.alive),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
