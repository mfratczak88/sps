import { Injectable } from '@angular/core';
import { BaseApi } from '../../../core/service/base.api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AssignDriverToParkingLot, DriverDto } from './drivers.model';

@Injectable({
  providedIn: 'root',
})
export class DriversApi extends BaseApi {
  readonly BASE_URL = `${environment.apiUrl}/drivers`;

  readonly PARKING_LOTS_URI = 'parkingLots';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll() {
    return this.http.get<DriverDto[]>(this.BASE_URL);
  }

  assignParkingLot(req: AssignDriverToParkingLot) {
    const { driverId } = req;
    return this.withCsrfToken(
      this.http.post<void>(
        `${this.BASE_URL}/${driverId}/${this.PARKING_LOTS_URI}`,
        req,
      ),
    );
  }
}
