import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCodeComponent } from './action-code.component';
import { RouterService } from '../../core/state/router/router.service';
import { AuthService } from '../../core/state/auth/auth.service';
import { AuthActionMode } from '../../core/state/auth/auth.model';
import { of, throwError } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { RouterQuery } from '../../core/state/router/router.query';

describe('ActionCodeComponent', () => {
  let fixture: ComponentFixture<ActionCodeComponent>;
  let routerServiceSpy: SpyObj<RouterService>;
  let authServiceSpy: SpyObj<AuthService>;
  let routerQuerySpy: SpyObj<RouterQuery>;
  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['verifyEmail']);
    routerQuerySpy = jasmine.createSpyObj('RouterQuery', ['authActionParams']);
    routerServiceSpy = jasmine.createSpyObj('RouterService', [
      'toInvalidAuthLink',
      'to404',
      'toSignIn',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ActionCodeComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceSpy,
        },
        {
          provide: RouterService,
          useValue: routerServiceSpy,
        },
        {
          provide: RouterQuery,
          useValue: routerQuerySpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionCodeComponent);
  });

  it('Navigates to 404 if oobCode is missing', () => {
    routerQuerySpy.authActionParams.and.returnValue({
      actionCode: null,
      mode: AuthActionMode.VERIFY_EMAIL,
    });
    fixture.detectChanges();
    expect(routerServiceSpy.to404).toHaveBeenCalled();
    expect(authServiceSpy.verifyEmail).not.toHaveBeenCalled();
  });
  it('Navigates to 404 if mode != verifyEmail', () => {
    routerQuerySpy.authActionParams.and.returnValue({
      actionCode: '43e3ee3',
      mode: AuthActionMode.RESET_PASSWORD,
    });
    fixture.detectChanges();
    expect(routerServiceSpy.to404).toHaveBeenCalled();
    expect(authServiceSpy.verifyEmail).not.toHaveBeenCalled();
  });
  it('Verify email - Calls auth service & navigates to sign in', () => {
    const oobCode = '4das1e3d';
    routerQuerySpy.authActionParams.and.returnValue({
      actionCode: oobCode,
      mode: AuthActionMode.VERIFY_EMAIL,
    });
    routerServiceSpy.toSignIn.and.resolveTo(void 0);
    authServiceSpy.verifyEmail.and.returnValue(of(void 0));
    fixture.detectChanges();
    expect(authServiceSpy.verifyEmail).toHaveBeenCalledWith(oobCode);
    expect(routerServiceSpy.toSignIn).toHaveBeenCalled();
  });
  it('Verify email - Navigates to invalid auth page on error from service', () => {
    const oobCode = '4rsczxczxc33311';
    routerQuerySpy.authActionParams.and.returnValue({
      actionCode: oobCode,
      mode: AuthActionMode.VERIFY_EMAIL,
    });
    routerServiceSpy.toInvalidAuthLink.and.resolveTo(void 0);
    authServiceSpy.verifyEmail.and.returnValue(
      throwError(() => new Error('foo')),
    );

    fixture.detectChanges();

    expect(routerServiceSpy.toSignIn).not.toHaveBeenCalled();
    expect(routerServiceSpy.toInvalidAuthLink).toHaveBeenCalled();
  });
});
