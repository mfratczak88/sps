import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInComponent } from './sign-in.component';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthService } from '../../core/state/auth/auth.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SharedModule } from '../../shared/shared.module';
import { EmailSignInFormComponent } from './email-sign-in-form/email-sign-in-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeadingComponent } from '../../shared/components/heading/heading.component';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { AuthTranslationKeys } from '../../core/translation-keys';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignInComponent', () => {
  let fixture: ComponentFixture<SignInComponent>;
  let navigationServiceSpy: SpyObj<NavigationService>;
  let authServiceSpy: SpyObj<AuthService>;
  let translateService: TranslateService;
  let emailFragment$: Subject<boolean>;

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
    emailFragment$ = new BehaviorSubject<boolean>(false);
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'toSameRoute',
      'toSignUp',
      'toPasswordReset',
      'emailFragment$',
      'navigateAfterLogin',
    ]);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'signInWithGoogle',
      'signIn',
    ]);
    navigationServiceSpy.emailFragment$.and.returnValue(emailFragment$);
    await TestBed.configureTestingModule({
      declarations: [SignInComponent, EmailSignInFormComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavigationService, useValue: navigationServiceSpy },
      ],
      imports: [
        TranslateTestingModule.withTranslations(
          'pl',
          await import('../../../assets/i18n/pl.json'),
        ).withTranslations('en', await import('../../../assets/i18n/en.json')),
        SharedModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
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
    emailFragment$.next(true);
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.sign-in__form--component'))
        .componentInstance,
    ).toBeTruthy();
  });
  it('Click on sign in with google calls auth service', () => {
    authServiceSpy.signInWithGoogle.and.returnValue(of({} as UserCredential));
    signInWithGoogleButton().click();
    fixture.detectChanges();
    expect(authServiceSpy.signInWithGoogle).toHaveBeenCalled();
    expect(navigationServiceSpy.navigateAfterLogin).toHaveBeenCalled();
  });
  it('On successfully signed in with email navigates to root url', () => {
    authServiceSpy.signIn.and.returnValue(of({} as UserCredential));
    emailFragment$.next(true);
    fixture.detectChanges();
    const email = 'maciek@gmail.com';
    const password = 'foo@bar@baz';
    const form = emailForm();
    form.submit.emit({ email, password });
    fixture.detectChanges();
    expect(authServiceSpy.signIn).toHaveBeenCalledWith(email, password);
    expect(navigationServiceSpy.navigateAfterLogin).toHaveBeenCalled();
  });
  it('On forgot password navigates to password reset', () => {
    emailFragment$.next(true);
    fixture.detectChanges();
    const form = emailForm();
    form.forgotPassword.emit();
    expect(navigationServiceSpy.toPasswordReset).toHaveBeenCalled();
  });
  it('On no account navigates to sign up', () => {
    emailFragment$.next(true);
    fixture.detectChanges();
    const form = emailForm();
    form.noAccount.emit();
    expect(navigationServiceSpy.toSignUp).toHaveBeenCalled();
  });
  it('On back from form navigates to sign in type options', () => {
    emailFragment$.next(true);
    fixture.detectChanges();
    const form = emailForm();
    form.back.emit();
    expect(navigationServiceSpy.toSameRoute).toHaveBeenCalled();
  });
  it('On Sign in with email calls navigation to same route with email fragment', () => {
    emailFragment$.next(true);
    const button = signInWithEmailButton();
    button.click();
    expect(navigationServiceSpy.toSameRoute).toHaveBeenCalledWith({
      fragment: 'email',
      queryParamsHandling: 'preserve',
    });
  });
});
