import { Injectable } from '@angular/core';
import { BaseApi } from '../../../core/service/base.api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Driver } from './drivers.model';

@Injectable({
  providedIn: 'root',
})
export class DriversApi extends BaseApi {
  readonly BASE_URL = 'drivers';

  constructor(http: HttpClient) {
    super(http);
  }

  getAll() {
    return this.http.get<Driver[]>(`${environment.apiUrl}/${this.BASE_URL}`);
  }
}
