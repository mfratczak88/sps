import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReservationsService } from '../../state/reservation/reservations.service';
import { ReservationsQuery } from '../../state/reservation/reservations.query';
import { DrawerKeys, DriverKeys } from '../../../core/translation-keys';
import { RouterQuery } from '../../../core/state/router/router.query';
import { concatMap } from 'rxjs/operators';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'sps-reservation-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class ReservationDetailsComponent implements OnInit, OnDestroy {
  translations = { ...DriverKeys, ...DrawerKeys };

  alive = true;

  constructor(
    readonly reservationService: ReservationsService,
    readonly query: ReservationsQuery,
    readonly routerQuery: RouterQuery,
  ) {}

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    this.routerQuery
      .reservationId$()
      .pipe(
        concatMap(id => this.reservationService.select(id)),
        takeWhile(() => this.alive),
      )
      .subscribe();
  }
}
