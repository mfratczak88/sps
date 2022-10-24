import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastService } from '../core/service/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../core/model/error.model';
import { RouterService } from '../core/state/router/router.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(
    private readonly toastService: ToastService,
    private readonly injector: Injector,
  ) {}

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      const body: ErrorResponse = error.error;
      console.log(body);
      return body.statusCode === 500
        ? this.injector.get(RouterService)?.toInternalServerErrorPage()
        : this.toastService.show(body.message);
    }
    return navigator.onLine
      ? console.error(error.message ? error.message : error.toString())
      : this.toastService.show('No Internet Connection');
  }
}
