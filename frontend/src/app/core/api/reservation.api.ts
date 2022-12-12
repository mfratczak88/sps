import { Injectable } from '@angular/core';
import { BaseApi } from './base.api';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  MakeReservation,
  Reservations,
  ReservationQueryModel,
  Reservation,
  ChangeTime,
} from '../model/reservation.model';
import { environment } from '../../../environments/environment';
import { Id } from '../model/common.model';
import { of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationApi extends BaseApi {
  BASE_URL = `${environment.apiUrl}/reservations`;

  constructor(http: HttpClient) {
    super(http);
  }

  getReservations(query?: ReservationQueryModel) {
    const params = this.fillHttpQueryParams(query);
    return this.http
      .get<Reservations>(`${this.BASE_URL}`, { params })
      .pipe(this.shareResponse(this.BASE_URL));
  }

  getReservation(id: Id) {
    return this.http.get<Reservation>(`${this.BASE_URL}/${id}`);
  }

  fillHttpQueryParams(query?: ReservationQueryModel) {
    let httpParams = new HttpParams();
    query &&
      Object.entries(query)
        .filter(([key, val]) => !!val)
        .forEach(([key, value]) => {
          httpParams = httpParams.set(key, value);
        });
    return httpParams;
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

  changeTime(data: ChangeTime) {
    const { reservationId } = data;
    return this.withCsrfToken(
      this.http.patch<void>(`${this.BASE_URL}/${reservationId}/time`, data),
    );
  }
}
