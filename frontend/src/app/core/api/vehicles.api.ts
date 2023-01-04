import { Injectable } from '@angular/core';
import { BaseApi } from './base.api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../model/driver.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehiclesApi extends BaseApi {
  readonly BASE_URL = `${environment.apiUrl}/vehicles`;

  constructor(http: HttpClient) {
    super(http);
  }

  findAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.BASE_URL);
  }
}
