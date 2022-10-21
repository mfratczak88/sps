import { ToastService } from '../core/service/toast.service';
import SpyObj = jasmine.SpyObj;
import { Injector } from '@angular/core';
import { RouterService } from '../core/state/router/router.service';
import { ErrorResponse } from '../core/model/error.model';
import { ErrorHandlerService } from './error.handler.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('Error handler service', () => {
  let toastServiceSpy: SpyObj<ToastService>;
  const injectorSpy: Injector = {
    get() {
      return routerServiceSpy;
    },
  };
  let routerServiceSpy: SpyObj<RouterService>;
  beforeEach(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    routerServiceSpy = jasmine.createSpyObj('RouterService', [
      'toInternalServerErrorPage',
    ]);
  });
  it('Displays message from http error', () => {
    const error: ErrorResponse = {
      message: 'Some error',
      messageCode: 'someMessageCode',
      timestamp: new Date().toISOString(),
      statusCode: 400,
    };
    new ErrorHandlerService(toastServiceSpy, injectorSpy).handleError(
      new HttpErrorResponse({
        error,
      }),
    );
    expect(toastServiceSpy.show).toHaveBeenCalledWith(error.message);
  });

  it('Displays client error in console', () => {
    const err = {
      message: 'foo',
    };
    new ErrorHandlerService(toastServiceSpy, injectorSpy).handleError(err);
    expect(toastServiceSpy.show).toHaveBeenCalledTimes(0);
  });
  it('Navigates to 500 error page when HTTP 500 error is received, without displaying toast', () => {
    const apiError: ErrorResponse = {
      message: 'An error occured',
      messageCode: 'unknownError',
      timestamp: new Date().toISOString(),
      statusCode: 500,
    };

    new ErrorHandlerService(toastServiceSpy, injectorSpy).handleError(
      new HttpErrorResponse({
        error: apiError,
      }),
    );
    expect(toastServiceSpy.show).toHaveBeenCalledTimes(0);
    expect(routerServiceSpy.toInternalServerErrorPage).toHaveBeenCalledTimes(1);
  });
});
