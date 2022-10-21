import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendAccountActivationComponent } from './resend-account-activation.component';
import { translateTestModule } from '../../../test.utils';
import { RouterQuery } from '../../core/state/router/router.query';
import SpyObj = jasmine.SpyObj;
import { RouterService } from '../../core/state/router/router.service';
import { AuthService } from '../../core/state/auth/auth.service';
import { By } from '@angular/platform-browser';

describe('ResendAccountActivationComponent', () => {
  let component: ResendAccountActivationComponent;
  let fixture: ComponentFixture<ResendAccountActivationComponent>;
  let routerQuerySpy: SpyObj<RouterQuery>;
  let routerServiceSpy: SpyObj<RouterService>;
  let authServiceSpy: SpyObj<AuthService>;
  beforeEach(async () => {
    routerQuerySpy = jasmine.createSpyObj('RouterQuery', [
      'previousActivationGuid',
    ]);
    routerServiceSpy = jasmine.createSpyObj('RouterService', [
      'to404',
      'toSignIn',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'resendActivationLink',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ResendAccountActivationComponent],
      imports: [await translateTestModule()],
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

    fixture = TestBed.createComponent(ResendAccountActivationComponent);
    component = fixture.componentInstance;
  });

  it('Navigates to 404 if previous activation guid is falsy', () => {
    routerQuerySpy.previousActivationGuid.and.returnValue('');
    component.ngOnInit();
    expect(routerServiceSpy.to404).toHaveBeenCalled();
  });
  it('Calls auth service on resend activation link & navigates to sign in', () => {
    const previousActivationGuid = '423e2';
    routerQuerySpy.previousActivationGuid.and.returnValue(
      previousActivationGuid,
    );
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    button.click();

    expect(authServiceSpy.resendActivationLink).toHaveBeenCalledWith(
      previousActivationGuid,
    );
  });
});
