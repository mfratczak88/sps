import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthUser, RegisterUserPayload, Role } from '../model/auth.model';
import { AuthApi } from './auth.api';

describe('Auth api spec', () => {
  let api: AuthApi;
  let httpTestingController: HttpTestingController;
  const baseUrl = environment.apiUrl;
  beforeEach(() => {
    const moduleRef = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthApi],
    });
    api = moduleRef.inject(AuthApi);
    httpTestingController = moduleRef.inject(HttpTestingController);
  });

  it('Sends login request with credentials', () => {
    const email = 'mfratczak88@gmail.com';
    const password = 'ssd3313escz$$$';
    const userResponse: AuthUser = {
      id: '3',
      email,
      name: 'Maciek',
      validToISO: new Date().toISOString(),
      authExpiresIn: '900',
      role: Role.DRIVER,
    };
    api.login(email, password).subscribe((data) => {
      expect(data).toEqual(userResponse);
    });

    const req = httpTestingController.expectOne(baseUrl + '/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toEqual(true);
    expect(req.request.body).toEqual({ email, password });

    req.flush(userResponse);
    httpTestingController.verify();
  });
  it('Sends to the API resp from google auth', () => {
    const idToken = '4';
    const email = 'mfratczak88@gmail.com';
    const user: AuthUser = {
      id: '4',
      email,
      name: 'Alex',
      validToISO: new Date().toISOString(),
      authExpiresIn: '900',
      role: Role.DRIVER,
    };
    api
      .loginWithGoogle(idToken, email)
      .subscribe((res) => expect(res).toEqual(user));

    const req = httpTestingController.expectOne(
      baseUrl + '/auth/loginWithGoogle',
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);
    expect(req.request.body).toEqual({ idToken, email });

    req.flush(user);

    httpTestingController.verify();
  });

  it('Sends register payload to the api', () => {
    const payload: RegisterUserPayload = {
      email: 'mfratczak88@gmail.com',
      name: 'Maciej',
      password: 'dsad9321dszxcx1!!',
    };

    api.register(payload).subscribe();

    const req = httpTestingController.expectOne(baseUrl + '/auth/register');

    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(false);
    expect(req.request.body).toEqual(payload);

    req.flush({});

    httpTestingController.verify();
  });

  it('Sends confirmation guid to the api', () => {
    const guid = '4423412';
    api.confirmRegistration(guid).subscribe((res) => expect(res).toEqual('ok'));
    const req = httpTestingController.expectOne(
      baseUrl + '/auth/confirmRegistration',
    );

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ activationGuid: guid });
    expect(req.request.withCredentials).toEqual(false);

    req.flush('ok');

    httpTestingController.verify();
  });

  it('Sends refresh token req to the api', () => {
    const user: AuthUser = {
      id: '3',
      email: 'alex33@gmail.com',
      name: 'Alex Sanchez',
      validToISO: new Date().toISOString(),
      authExpiresIn: '900',
      role: Role.DRIVER,
    };
    api.refreshToken().subscribe((res) => expect(res).toEqual(user));

    const req = httpTestingController.expectOne(baseUrl + '/auth/refresh');

    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);

    req.flush(user);

    httpTestingController.verify();
  });

  it('Sends logout req with credentials', () => {
    api.logout().subscribe((res) => expect(res).toBeFalsy());

    const req = httpTestingController.expectOne(baseUrl + '/auth/logout');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(null);
    expect(req.request.withCredentials).toEqual(true);

    req.flush(null);

    httpTestingController.verify();
  });

  it('Sends resend activation link req to the api', () => {
    const previousGuid = '4';
    api
      .resendActivationLink(previousGuid)
      .subscribe((res) => expect(res).toBeFalsy());

    const req = httpTestingController.expectOne(
      baseUrl + '/auth/resendRegistrationConfirmation',
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ activationGuid: previousGuid });

    req.flush(null);

    httpTestingController.verify();
  });
});
