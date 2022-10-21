import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AuthService } from '../state/auth/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshingInProgress = false;

  constructor(private readonly injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
      withCredentials: true,
      headers: req.headers.set(
        'X-CSRF-TOKEN',
        localStorage.getItem('_csrf') || '',
      ),
    });
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.refreshToken(authReq, next);
        }
        return throwError(error);
      }),
    );
  }

  private refreshToken(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    if (!this.refreshingInProgress) {
      this.refreshingInProgress = true;
      return authService.refreshToken().pipe(
        switchMap(() => {
          this.refreshingInProgress = false;
          return next.handle(req);
        }),
        catchError(err => {
          authService.logout();
          this.refreshingInProgress = false;
          return throwError(err);
        }),
      );
    } else {
      return next.handle(req);
    }
  }
}
