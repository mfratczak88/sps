import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccountComponent } from './confirm-account.component';
import { MessageCode } from '../../core/model/error.model';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthState } from '../../core/store/auth/auth.state';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AuthActions } from '../../core/store/actions/auth.actions';
import Spy = jasmine.Spy;
import { setRouterParams } from '../../../../test/store.util';
import { CoreModule } from '../../core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { translateTestModule } from '../../../test.utils';
import { RouterTestingModule } from '@angular/router/testing';

describe('ConfirmAccountComponent', () => {
  let component: ConfirmAccountComponent;
  let fixture: ComponentFixture<ConfirmAccountComponent>;
  let store: Store;
  let dispatchSpy: Spy<(actionOrActions: any) => Observable<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmAccountComponent],
      imports: [
        await translateTestModule(),
        CoreModule,
        SharedModule,
        RouterTestingModule,
        NgxsModule.forRoot([AuthState]),
        NgxsRouterPluginModule.forRoot(),
      ],
    }).compileComponents();
    store = TestBed.inject(Store);
    setRouterParams(store, { activationGuid: '1' });
    dispatchSpy = spyOn(store, 'dispatch');
  });
  beforeEach(async () => {
    fixture = TestBed.createComponent(ConfirmAccountComponent);
    component = fixture.componentInstance;
  });
  it('Navigates to 404 page if activation guid is falsy', () => {
    // given
    setRouterParams(store, { activationGuid: undefined });

    // when
    component.ngOnInit();

    //then
    expect(store.dispatch).toHaveBeenCalledWith(
      new AuthActions.NavigateToNotFound(),
    );
  });
  it('Success -- Dispatches confirm registration action with activation guid from url params', () => {
    // given
    setRouterParams(store, { activationGuid: '1' });
    dispatchSpy.and.returnValue(of({}));

    // when
    component.ngOnInit();

    // then
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToSignIn(),
    );
  });
  it('Fail -- If error has URL_NO_LONGER_VALID message code it redirects to resend link', () => {
    // given
    setRouterParams(store, { activationGuid: '1' });
    dispatchSpy.and.callFake(action =>
      action instanceof AuthActions.ConfirmRegistration
        ? throwError(() => ({
            error: {
              messageCode: MessageCode.URL_NO_LONGER_VALID,
            },
          }))
        : NEVER,
    );

    // when
    component.ngOnInit();

    // then
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToResendActivationLink('1'),
    );
  });
});
