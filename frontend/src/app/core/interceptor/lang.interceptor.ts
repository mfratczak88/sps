import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { lang } from '../store/ui/ui.selector';

@Injectable()
export class LangInterceptor implements HttpInterceptor {
  constructor(private readonly store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const { isoCode: langIsoCode } = this.store.selectSnapshot(lang) || {};
    return langIsoCode
      ? next.handle(
          req.clone({
            headers: req.headers.set('Accept-Language', langIsoCode),
          }),
        )
      : next.handle(req);
  }
}
