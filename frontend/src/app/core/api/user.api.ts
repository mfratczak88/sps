import { BaseApi } from './base.api';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Role } from '../model/auth.model';
import { UserResponse } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserApi extends BaseApi {
  readonly BASE_URL = `${environment.apiUrl}/users`;

  constructor(http: HttpClient) {
    super(http);
  }

  getAll() {
    return this.http.get<UserResponse[]>(this.BASE_URL);
  }

  changeRole(userId: string, newRole: Role) {
    return this.withCsrfToken(
      this.http.patch<void>(`${this.BASE_URL}/${userId}`, {
        role: newRole,
      }),
    );
  }
}
