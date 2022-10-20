import { NotFoundInterceptor } from '../../../../../src/infrastructure/web/interceptor/not-found.interceptor';
import {
  CallHandler,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';
import clearAllMocks = jest.clearAllMocks;

describe('Not found interceptor', () => {
  const interceptor = new NotFoundInterceptor();
  const next = createMock<CallHandler>();
  const executionContext = createMock<ExecutionContext>();
  beforeEach(() => {
    clearAllMocks();
  });
  it('Throws when is response is falsy', (done) => {
    const falsyResponse = of(undefined);
    next.handle.mockReturnValue(falsyResponse);
    interceptor.intercept(executionContext, next).subscribe({
      error: (err) => (err instanceof NotFoundException ? done() : done.fail()),
    });
  });
  it('Pass it over if response is truthy', (done) => {
    const truthyResponse = of('some value');
    next.handle.mockReturnValue(truthyResponse);
    interceptor.intercept(executionContext, next).subscribe((val) => {
      val === 'some value' ? done() : done.fail();
    });
  });
});
