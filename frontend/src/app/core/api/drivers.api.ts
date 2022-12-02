import { Injectable } from '@angular/core';
import { BaseApi } from './base.api';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Driver as DriverView } from '../model/driver.model';
import {
  AssignDriverToParkingLot,
  Driver as AdminView,
  RemoveParkingLotAssignment,
} from '../model/admin.model';

@Injectable({
  providedIn: 'root',
})
export class DriversApi extends BaseApi {
  readonly BASE_URL = `${environment.apiUrl}/drivers`;

  readonly PARKING_LOTS_URI = 'parkingLots';

  readonly VEHICLES_URI = 'vehicles';

  constructor(http: HttpClient) {
    super(http);
  }

  getById(id: string) {
    return this.http.get<DriverView>(`${this.BASE_URL}/${id}`);
  }

  getAll() {
    return this.http.get<AdminView[]>(this.BASE_URL);
  }

  addVehicle(licensePlate: string, driverId: string) {
    return this.withCsrfToken(
      this.http.post<void>(
        `${this.BASE_URL}/${driverId}/${this.VEHICLES_URI}`,
        {
          driverId,
          licensePlate,
        },
      ),
    );
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

  removeParkingLotAssignment(req: RemoveParkingLotAssignment) {
    const { driverId, parkingLotId } = req;
    return this.withCsrfToken(
      this.http.delete<void>(
        `${this.BASE_URL}/${driverId}/${this.PARKING_LOTS_URI}/${parkingLotId}`,
      ),
    );
  }
}
