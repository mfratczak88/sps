import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Reservation } from '../../../core/model/reservation.model';
import { Id } from '../../../core/model/common.model';

export interface ReservationState extends EntityState<Reservation, Id> {
  page: number;
  pageSize: number;
  count: number;
}
@StoreConfig({
  name: 'reservations',
})
@Injectable({
  providedIn: 'root',
})
export class ReservationsStore extends EntityStore<ReservationState> {
  constructor() {
    super({
      count: 0,
      page: 1,
      pageSize: 10,
    });
  }
}
