import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCodeComponent } from './action-code.component';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthService } from '../../core/state/auth/auth.service';
import { AuthActionMode } from '../../core/state/auth/auth.model';
import { of, throwError } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('ActionCodeComponent', () => {
  let fixture: ComponentFixture<ActionCodeComponent>;
  let navigationServiceSpy: SpyObj<NavigationService>;
  let authServiceSpy: SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['verifyEmail']);
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'actionCodeParamsFromActivatedRoute',
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
          provide: NavigationService,
          useValue: navigationServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionCodeComponent);
  });

  it('Navigates to 404 if oobCode is missing', () => {
    navigationServiceSpy.actionCodeParamsFromActivatedRoute.and.returnValue({
      oobCode: null,
      mode: AuthActionMode.VERIFY_EMAIL,
    });
    fixture.detectChanges();
    expect(navigationServiceSpy.to404).toHaveBeenCalled();
    expect(authServiceSpy.verifyEmail).not.toHaveBeenCalled();
  });
  it('Navigates to 404 if mode != verifyEmail', () => {
    navigationServiceSpy.actionCodeParamsFromActivatedRoute.and.returnValue({
      oobCode: '43e3ee3',
      mode: AuthActionMode.RESET_PASSWORD,
    });
    fixture.detectChanges();
    expect(navigationServiceSpy.to404).toHaveBeenCalled();
    expect(authServiceSpy.verifyEmail).not.toHaveBeenCalled();
  });
  it('Verify email - Calls auth service & navigates to sign in', () => {
    const oobCode = '4das1e3d';
    navigationServiceSpy.actionCodeParamsFromActivatedRoute.and.returnValue({
      oobCode,
      mode: AuthActionMode.VERIFY_EMAIL,
    });
    navigationServiceSpy.toSignIn.and.resolveTo(void 0);
    authServiceSpy.verifyEmail.and.returnValue(of(void 0));
    fixture.detectChanges();
    expect(authServiceSpy.verifyEmail).toHaveBeenCalledWith(oobCode);
    expect(navigationServiceSpy.toSignIn).toHaveBeenCalled();
  });
  it('Verify email - Navigates to invalid auth page on error from service', () => {
    const oobCode = '4rsczxczxc33311';
    navigationServiceSpy.actionCodeParamsFromActivatedRoute.and.returnValue({
      oobCode,
      mode: AuthActionMode.VERIFY_EMAIL,
    });
    navigationServiceSpy.toInvalidAuthLink.and.resolveTo(void 0);
    authServiceSpy.verifyEmail.and.returnValue(
      throwError(() => new Error('foo')),
    );

    fixture.detectChanges();

    expect(navigationServiceSpy.toSignIn).not.toHaveBeenCalled();
    expect(navigationServiceSpy.toInvalidAuthLink).toHaveBeenCalled();
  });
});
