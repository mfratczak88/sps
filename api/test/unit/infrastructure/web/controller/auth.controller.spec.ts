import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  AuthenticationService,
  ChangePasswordCommand,
  ConfirmRegistrationCommand,
  LoginCommand,
  LoginWithGoogleCommand,
  RegisterUserCommand,
  ResendRegistrationConfirmationCommand,
} from '../../../../../src/infrastructure/security/authentication/authentication.service';
import { TokenService } from '../../../../../src/infrastructure/security/token.service';
import { AuthController } from '../../../../../src/infrastructure/web/controller/auth.controller';
import { Request, Response } from 'express';
import { RequestWithUser } from '../../../../../src/infrastructure/security/authorization/jwt.strategy';
import { Role } from '../../../../../src/infrastructure/security/authorization/role';
import { User } from '../../../../../src/infrastructure/security/user/user';
describe('Auth controller', () => {
  let authServiceMock: DeepMocked<AuthenticationService>;
  let tokenServiceMock: DeepMocked<TokenService>;
  let authController: AuthController;
  beforeEach(() => {
    authServiceMock = createMock<AuthenticationService>();
    tokenServiceMock = createMock<TokenService>();
    authController = new AuthController(authServiceMock, tokenServiceMock);
  });

  it('Delegates login command to auth service', async () => {
    const request = createMock<Request>();
    const response = createMock<Response>();
    const loginCommand = createMock<LoginCommand>();

    await authController.login(request, loginCommand, response);

    expect(authServiceMock.login).toHaveBeenCalledWith(loginCommand, response);
  });
  it('Delegates login with google command to auth service', async () => {
    const response = createMock<Response>();
    const loginCommand = createMock<LoginWithGoogleCommand>();

    await authController.loginWithGoogle(loginCommand, response);

    expect(authServiceMock.loginWithGoogle).toHaveBeenCalledWith(
      loginCommand,
      response,
    );
  });
  it('On change password calls auth service with userId from request', async () => {
    const request = createMock<RequestWithUser>();
    request.user.id = '4';
    request.user.role = Role.ADMIN;
    const changePasswordCommand = createMock<ChangePasswordCommand>();

    await authController.changePassword(changePasswordCommand, request);

    expect(authServiceMock.changePassword).toHaveBeenCalledWith(
      changePasswordCommand,
      request.user.id,
    );
  });
  it('Delegates logout call to auth service', async () => {
    const response = createMock<Response>();

    await authController.logout(response);

    expect(authServiceMock.logout).toHaveBeenCalledWith(response);
  });
  it('Delegates register call to auth service', async () => {
    const command = createMock<RegisterUserCommand>();

    await authController.register(command);

    expect(authServiceMock.register).toHaveBeenCalledWith(command);
  });
  it('Delegates call csrf token generation to token service and returns token', async () => {
    const response = createMock<Response>();
    tokenServiceMock.generateCsrfToken.mockReturnValue('444');

    const controllerResp = await authController.getCsrfToken(response);

    expect(controllerResp.csrfToken).toEqual('444');
    expect(tokenServiceMock.generateCsrfToken).toHaveBeenCalledWith(response);
  });
  it('Delegates confirm registration call to auth service', async () => {
    const command = createMock<ConfirmRegistrationCommand>();

    await authController.confirmRegistration(command);

    expect(authServiceMock.confirmRegistration).toHaveBeenCalledWith(command);
  });
  it('Delegates resend confirmation link to auth service', async () => {
    const command = createMock<ResendRegistrationConfirmationCommand>();

    await authController.resendRegistrationConfirmation(command);

    expect(authServiceMock.resendAccountConfirmationLink).toHaveBeenCalledWith(
      command,
    );
  });
  it('Delegates refresh token to auth service', async () => {
    const req = createMock<RequestWithUser>();
    const res = createMock<Response>();
    const user = createMock<User>();
    req.user = user;

    await authController.refreshToken(req, res);

    expect(authServiceMock.onRefreshToken).toHaveBeenCalledWith(res, user);
  });
});
