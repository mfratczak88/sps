import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private auth: AngularFireAuth) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.auth.idToken.pipe(
      take(1),
      switchMap(idToken => {
        let clone = req.clone();
        if (idToken) {
          clone = clone.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + idToken),
          });
        }
        return next.handle(clone);
      }),
    );
  }
}

export const AuthTokenHttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthTokenInterceptor,
  multi: true,
};
