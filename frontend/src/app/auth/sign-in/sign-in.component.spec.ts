import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { EmailSignInFormComponent } from './email-sign-in-form/email-sign-in-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeadingComponent } from '../../shared/components/heading/heading.component';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { AuthTranslationKeys } from '../../core/translation-keys';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DispatchSpy, newDispatchSpy } from '../../../../test/spy.util';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AuthState } from '../../core/store/auth/auth.state';
import { setFragment } from '../../../../test/store.util';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { CoreModule } from '../../core/core.module';
import { translateTestModule } from '../../../test.utils';

describe('SignInComponent', () => {
  let fixture: ComponentFixture<SignInComponent>;
  let translateService: TranslateService;
  let store: Store;
  let dispatchSpy: DispatchSpy;
  const emailForm = () =>
    fixture.debugElement.query(By.directive(EmailSignInFormComponent))
      .componentInstance as EmailSignInFormComponent;

  const signInWithEmailButton = () =>
    fixture.debugElement.query(By.css('.sign-in__form--email-button'))
      .nativeElement as HTMLButtonElement;
  const signInWithGoogleButton = () =>
    fixture.debugElement.query(By.css('.sign-in__form--google-button'))
      .nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignInComponent, EmailSignInFormComponent],
      imports: [
        await translateTestModule(),
        SharedModule,
        RouterTestingModule,
        CoreModule,
        NgxsModule.forRoot([AuthState]),
        NgxsRouterPluginModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
    store = TestBed.inject(Store);
    dispatchSpy = newDispatchSpy(store);
  });
  it('Shows AUTH.SIGN_IN_TITLE translated text as heading', () => {
    const heading = fixture.debugElement.query(By.directive(HeadingComponent))
      .nativeElement as HTMLElement;

    expect(heading.innerText?.trim()).toEqual(
      translateService.instant(AuthTranslationKeys.SIGN_IN_TITLE),
    );
  });
  it('Shows sign in options buttons with translations', () => {
    expect(signInWithEmailButton().innerText.trim()).toEqual(
      translateService.instant(AuthTranslationKeys.SIGN_IN_WITH_EMAIL),
    );
    expect(signInWithGoogleButton().innerText.trim()).toEqual(
      translateService.instant(AuthTranslationKeys.SIGN_IN_WITH_GOOGLE),
    );
  });
  it('Shows sign in form when email url fragment is active', () => {
    setFragment(store, 'email');
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.sign-in__form--component'))
        .componentInstance,
    ).toBeTruthy();
  });
  it('Click on sign in with google calls auth service', () => {
    dispatchSpy.and.returnValue(of({}));
    signInWithGoogleButton().click();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(new AuthActions.LoginWithGoogle());
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateAfterLogin('/'),
    );
  });
  it('On successfully signed in with email navigates to root url', () => {
    dispatchSpy.and.returnValues(of({}), of({}));
    setFragment(store, 'email');
    fixture.detectChanges();
    const form = emailForm();

    form.submitted.emit({ email: 'email', password: 'pass' });
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.Login('email', 'pass'),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateAfterLogin('/'),
    );
  });
  it('On no account navigates to sign up', () => {
    setFragment(store, 'email');
    fixture.detectChanges();
    const form = emailForm();
    form.noAccount.emit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToSignUp(),
    );
  });
  it('On back from form navigates to sign in type options', () => {
    setFragment(store, 'email');
    fixture.detectChanges();
    const form = emailForm();
    form.back.emit();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToSameRoute(),
    );
  });
  it('On Sign in with email calls navigation to same route with email fragment', () => {
    fixture.detectChanges();
    const button = signInWithEmailButton();
    button.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToSameRoute('email'),
    );
  });
});
