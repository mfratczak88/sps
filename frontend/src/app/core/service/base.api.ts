import { HttpClient } from '@angular/common/http';
import { finalize, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { concatMap, shareReplay, tap } from 'rxjs/operators';

export class BaseApi {
  private pendingReqs = new Map<string, Observable<any>>();

  constructor(protected readonly http: HttpClient) {}

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

export interface CsrfToken {
  csrfToken: string;
}
