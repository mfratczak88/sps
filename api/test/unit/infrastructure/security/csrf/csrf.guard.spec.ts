import { CsrfGuard } from '../../../../../src/infrastructure/security/csrf/csrf.guard';
import { instance, mock, reset, verify, when } from 'ts-mockito';
import { Request } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ExecutionContext } from '@nestjs/common';
import { TokenService } from '../../../../../src/infrastructure/security/token.service';
describe('CSRF guard unit test', () => {
  const tokenServiceMock = mock(TokenService);
  const tokenService = instance(tokenServiceMock);
  const csrfGuard = new CsrfGuard(tokenService);
  const executionContextMock = mock<ExecutionContext>();
  const executionContext = instance(executionContextMock);
  const requestObjectMock = mock<Request>();
  const request = instance(requestObjectMock);
  beforeEach(() => {
    reset<unknown>(tokenServiceMock);
  });
  it('Should pass request object to csrfService', async () => {
    when(executionContextMock.switchToHttp()).thenReturn({
      getRequest: () => request,
      getNext: jest.fn(),
      getResponse: jest.fn(),
    } as HttpArgumentsHost);

    await csrfGuard.canActivate(executionContext);

    verify(tokenServiceMock.validCsrfToken(request)).once();
  });
  it('Should return false when service returns false', async () => {
    when(executionContextMock.switchToHttp()).thenReturn({
      getRequest: () => request,
      getNext: jest.fn(),
      getResponse: jest.fn(),
    } as HttpArgumentsHost);
    when(tokenServiceMock.validCsrfToken(request)).thenReturn(false);
    const result = await csrfGuard.canActivate(executionContext);

    expect(result).toBe(false);
  });
  it('Should return true if service returns true', async () => {
    when(executionContextMock.switchToHttp()).thenReturn({
      getRequest: () => request,
      getNext: jest.fn(),
      getResponse: jest.fn(),
    } as HttpArgumentsHost);
    when(tokenServiceMock.validCsrfToken(request)).thenReturn(true);
    const result = await csrfGuard.canActivate(executionContext);

    expect(result).toBe(true);
  });
  it('should propagate exception when CSRF service throws an exception', async () => {
    when(executionContextMock.switchToHttp()).thenReturn({
      getRequest: () => request,
      getNext: jest.fn(),
      getResponse: jest.fn(),
    } as HttpArgumentsHost);
    when(tokenServiceMock.validCsrfToken(request)).thenThrow(
      new Error('CSRF error'),
    );
    try {
      await csrfGuard.canActivate(executionContext);
      fail();
    } catch (e) {}
  });
});
