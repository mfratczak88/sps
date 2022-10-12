import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavigationService } from '../core/service/navigation.service';
import { ErrorCodes } from '../core/model/api.model';
import { ToastService } from '../core/service/toast.service';
import { TranslationService } from '../core/service/translation.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  constructor(private readonly injector: Injector) {}

  handleError(error: any) {
    const toastService = this.injector.get(ToastService);
    const translationService = this.injector.get(TranslationService);
    if (error.code && error.message) {
      console.log(error);

      return error.code === ErrorCodes.INTERNAL_ERROR
        ? this.injector.get(NavigationService)?.toInternalServerErrorPage()
        : toastService.show(
            translationService.translateErrorCode(
              error.code as ErrorCodes,
              error.message,
            ),
          );
    }
    return navigator.onLine
      ? console.error(error.message ? error.message : error.toString())
      : toastService.show(`No Internet Connection`);
  }
}
