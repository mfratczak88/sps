import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthUser, RegisterUserPayload } from '../model/auth.model';
import { BaseApi } from './base.api';

@Injectable({
  providedIn: 'root',
})
export class AuthApi extends BaseApi {
  constructor(http: HttpClient) {
    super(http);
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(
        `${environment.apiUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // unless it's set here, cookies will not be set in the user agent
        },
      )
      .pipe(map(loginRes => ({ ...loginRes })));
  }

  loginWithGoogle(idToken: string, email: string): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(
        `${environment.apiUrl}/auth/loginWithGoogle`,
        {
          idToken,
          email,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(map(loginRes => ({ ...loginRes })));
  }

  register(command: RegisterUserPayload) {
    return this.http.post<void>(`${environment.apiUrl}/auth/register`, command);
  }

  confirmRegistration(id: string) {
    return this.http.post(`${environment.apiUrl}/auth/confirmRegistration`, {
      activationGuid: id,
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post<void>(`${environment.apiUrl}/auth/changePassword`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  refreshToken(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(environment.apiUrl + '/auth/refresh', {
        withCredentials: true,
      })
      .pipe(map(loginRes => ({ ...loginRes })));
  }

  logout() {
    return this.http.post(environment.apiUrl + '/auth/logout', null, {
      withCredentials: true,
    });
  }

  resendActivationLink(previousGuid: string) {
    return this.http.post<void>(
      `${environment.apiUrl}/auth/resendRegistrationConfirmation`,
      {
        activationGuid: previousGuid,
      },
    );
  }
}
