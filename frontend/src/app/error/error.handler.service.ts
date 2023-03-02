import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { ErrorResponse } from '../core/model/error.model';
import { ToastService } from '../core/service/toast.service';
import { ErrorActions } from '../core/store/actions/error.actions';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(
    private readonly toastService: ToastService,
    private readonly injector: Injector,
  ) {}

  handleError(error: HttpErrorResponse | Error | { message: string }) {
    if (error instanceof HttpErrorResponse) {
      const body: ErrorResponse = error.error;
      console.log(body);
      return body.statusCode === 500
        ? this.injector
            .get(Store)
            ?.dispatch(new ErrorActions.NavigateToInternalServerErrorPage())
        : this.toastService.show(body.message);
    }
    return navigator.onLine
      ? console.error(error.message ? error.message : error.toString())
      : this.toastService.show('No Internet Connection');
  }
}
