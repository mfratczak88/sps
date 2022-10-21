import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegisterUserPayload, User } from './auth.model';
import { BaseApi } from '../../service/base.api';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApi extends BaseApi {
  constructor(http: HttpClient) {
    super(http);
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(
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

  loginWithGoogle(idToken: string, email: string): Observable<User> {
    return this.http
      .post<User>(
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

  register(command: RegisterUserPayload): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, command);
  }

  confirmRegistration(id: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/confirmRegistration`, {
      activationGuid: id,
    });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/changePassword`, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });
  }

  refreshToken(): Observable<User> {
    return this.http
      .get<User>(environment.apiUrl + '/auth/refresh', {
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
