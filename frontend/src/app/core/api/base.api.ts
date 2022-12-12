import { HttpClient } from '@angular/common/http';
import {
  concatMap,
  finalize,
  MonoTypeOperatorFunction,
  Observable,
  shareReplay,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { CsrfToken } from '../model/auth.model';
import { tap } from 'rxjs/operators';

export class BaseApi {
  readonly CSRF_TOKEN_URL = `${environment.apiUrl}/auth/csrfToken`;

  private pendingReqs = new Map<string, Observable<any>>();

  constructor(protected readonly http: HttpClient) {}

  protected withCsrfToken<T>(request: Observable<T>) {
    return this.http
      .get<CsrfToken>(this.CSRF_TOKEN_URL, {
        withCredentials: true,
      })
      .pipe(
        tap(token => localStorage.setItem('_csrf', token.csrfToken)),
        concatMap(() => request),
      );
  }

  shareResponse<T>(id: string): MonoTypeOperatorFunction<T> {
    return source => {
      if (!this.pendingReqs.has(id)) {
        this.pendingReqs.set(id, source.pipe(shareReplay(1)));
      }
      return (this.pendingReqs.get(id) as Observable<T>).pipe(
        finalize(() => this.pendingReqs.delete(id)),
      );
    };
  }
}
