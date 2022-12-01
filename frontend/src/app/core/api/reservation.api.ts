import { Injectable } from '@angular/core';
import { BaseApi } from './base.api';
import { HttpClient } from '@angular/common/http';
import { MakeReservation } from '../model/driver.model';
import { environment } from '../../../environments/environment';

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
}
