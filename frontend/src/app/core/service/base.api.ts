import { HttpClient } from '@angular/common/http';
import { concatMap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CsrfToken } from '../model/auth.model';
import { tap } from 'rxjs/operators';

export class BaseApi {
  constructor(protected readonly http: HttpClient) {}

  protected withCsrfToken<T>(request: Observable<T>) {
    return this.http
      .get<CsrfToken>(`${environment.apiUrl}/auth/csrfToken`, {
        withCredentials: true,
      })
      .pipe(
        tap(token => localStorage.setItem('_csrf', token.csrfToken)),
        concatMap(() => request),
      );
  }
}
