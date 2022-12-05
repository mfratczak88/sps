import { Injectable } from '@angular/core';
import { BaseApi } from './base.api';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MakeReservation } from '../model/reservation.model';
import { environment } from '../../../environments/environment';
import { Reservation } from '../model/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationApi extends BaseApi {
  BASE_URL = `${environment.apiUrl}/reservations`;

  constructor(http: HttpClient) {
    super(http);
  }

  getForDriver(driverId: string) {
    return this.http.get<Reservation[]>(this.BASE_URL, {
      params: new HttpParams().set('driverId', driverId),
    });
  }

  makeReservation(req: MakeReservation) {
    return this.withCsrfToken(this.http.post<void>(this.BASE_URL, req));
  }
}
