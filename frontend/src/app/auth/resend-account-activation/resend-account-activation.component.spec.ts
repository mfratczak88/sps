import { ComponentFixture, TestBed } from '@angular/core/testing';

import { translateTestModule } from '../../../test.utils';
import { ResendAccountActivationComponent } from './resend-account-activation.component';

import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { DispatchSpy, newDispatchSpy } from '../../../../test/spy.util';
import { setRouterQueryParams } from '../../../../test/store.util';
import { CoreModule } from '../../core/core.module';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { AuthState } from '../../core/store/auth/auth.state';
import { SharedModule } from '../../shared/shared.module';

describe('ResendAccountActivationComponent', () => {
  let component: ResendAccountActivationComponent;
  let fixture: ComponentFixture<ResendAccountActivationComponent>;
  let store: Store;
  let dispatchSpy: DispatchSpy;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResendAccountActivationComponent],
      imports: [
        SharedModule,
        await translateTestModule(),
        CoreModule,
        NgxsModule.forRoot([AuthState]),
        RouterTestingModule,
        NgxsRouterPluginModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResendAccountActivationComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = newDispatchSpy(store);
  });

  it('Navigates to 404 if previous activation guid is falsy', () => {
    setRouterQueryParams(store, { previousActivationGuid: '' });

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToNotFound(),
    );
  });
  it('Calls auth service on resend activation link & navigates to sign in', () => {
    const previousActivationGuid = '423e2';
    setRouterQueryParams(store, { previousActivationGuid });
    dispatchSpy.and.callFake(() => of({}));
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;

    button.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.ResendActionLink(previousActivationGuid),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToSignIn(),
    );
  });
});
