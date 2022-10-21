import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccountComponent } from './confirm-account.component';
import { AuthService } from '../../core/state/auth/auth.service';
import { RouterService } from '../../core/state/router/router.service';
import { RouterQuery } from '../../core/state/router/router.query';
import { MessageCode } from '../../core/model/error.model';
import { of, throwError } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('ConfirmAccountComponent', () => {
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;
  let authServiceSpy: SpyObj<AuthService>;
  let routerServiceSpy: SpyObj<RouterService>;
  let routerQuerySpy: SpyObj<RouterQuery>;
  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'confirmRegistration',
    ]);

    routerServiceSpy = jasmine.createSpyObj('RouterService', [
      'toResendActivationLink',
      'toSignIn',
      'to404',
    ]);
    routerQuerySpy = jasmine.createSpyObj('RouterQuery', ['activationGuid']);
    await TestBed.configureTestingModule({
      declarations: [ConfirmAccountComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: RouterService, useValue: routerServiceSpy },
        { provide: RouterQuery, useValue: routerQuerySpy },
      ],
    }).compileComponents();
  });
  beforeEach(async () => {
    fixture = TestBed.createComponent(ConfirmAccountComponent);
    component = fixture.componentInstance;
  });
  it('Navigates to 404 page if activation guid is falsy', () => {
    // given
    routerQuerySpy.activationGuid.and.returnValue('');

    // when
    component.ngOnInit();

    //then
    expect(routerServiceSpy.to404).toHaveBeenCalled();
  });
  it('Success -- Calls auth service with activation guid from url params', () => {
    // given
    routerQuerySpy.activationGuid.and.returnValue('123');
    authServiceSpy.confirmRegistration.and.returnValue(of({}));

    // when
    component.ngOnInit();

    // then
    expect(authServiceSpy.confirmRegistration).toHaveBeenCalledWith('123');
    expect(routerServiceSpy.toSignIn).toHaveBeenCalled();
  });
  it('Fail -- If error has URL_NO_LONGER_VALID message code it redirects to resend link', () => {
    // given
    routerQuerySpy.activationGuid.and.returnValue('432');
    authServiceSpy.confirmRegistration.and.returnValue(
      throwError(() => ({
        error: {
          messageCode: MessageCode.URL_NO_LONGER_VALID,
        },
      })),
    );

    // when
    component.ngOnInit();

    // then
    expect(routerServiceSpy.toResendActivationLink).toHaveBeenCalledWith('432');
  });
});
