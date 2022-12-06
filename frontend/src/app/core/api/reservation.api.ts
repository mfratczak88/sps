import { Injectable } from '@angular/core';
import { BaseApi } from './base.api';
import { HttpClient } from '@angular/common/http';
import { MakeReservation } from '../model/reservation.model';
import { environment } from '../../../environments/environment';
import { Id } from '../model/common.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationApi extends BaseApi {
  BASE_URL = `${environment.apiUrl}/reservations`;

  constructor(http: HttpClient) {
    super(http);
  }

  makeReservation(req: MakeReservation) {
    return this.withCsrfToken(this.http.post<void>(this.BASE_URL, req));
  }

  confirmReservation(id: Id) {
    return this.withCsrfToken(
      this.http.patch<void>(`${this.BASE_URL}/${id}/confirm`, null),
    );
  }

  cancelReservation(id: Id) {
    return this.withCsrfToken(
      this.http.patch<void>(`${this.BASE_URL}/${id}/cancel`, null),
    );
  }
}
