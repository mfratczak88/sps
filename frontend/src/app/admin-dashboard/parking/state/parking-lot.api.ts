import { Injectable } from '@angular/core';
import { BaseApi } from '../../../core/service/base.api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  ChangeHoursOfOperations,
  CreateParkingLot,
  ParkingLot,
} from '../../../core/model/parking-lot.model';

@Injectable({
  providedIn: 'root',
})
export class ParkingLotApi extends BaseApi {
  readonly BASE_URL = `${environment.apiUrl}/parking-lots`;

  readonly HOURS_URI = 'hoursOfOperation';

  readonly CAPACITY_URI = 'capacity';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll() {
    return this.http.get<ParkingLot[]>(this.BASE_URL);
  }

  changeHours(hours: ChangeHoursOfOperations, parkingLotId: string) {
    return this.withCsrfToken(
      this.http.patch<void>(
        `${this.BASE_URL}/${parkingLotId}/${this.HOURS_URI}`,
        {
          ...hours,
          parkingLotId: parkingLotId,
        },
      ),
    );
  }

  create(data: CreateParkingLot) {
    return this.withCsrfToken(this.http.post(`${this.BASE_URL}`, data));
  }

  changeCapacity(capacity: number, parkingLotId: string) {
    return this.withCsrfToken(
      this.http.patch<void>(
        `${this.BASE_URL}/${parkingLotId}/${this.CAPACITY_URI}`,
        {
          capacity,
          parkingLotId,
        },
      ),
    );
  }
}
