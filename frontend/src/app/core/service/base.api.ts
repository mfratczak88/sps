import { HttpClient } from '@angular/common/http';

export class BaseApi {
  constructor(protected readonly http: HttpClient) {}
}
