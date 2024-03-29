import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { translateTestModule } from '../../../test.utils';
import {
  AuthTranslationKeys,
  FormErrorKeys,
} from '../../core/translation-keys';
import { HeadingComponent } from '../../shared/components/heading/heading.component';
import { LinkComponent } from '../../shared/components/link/link.component';
import { SharedModule } from '../../shared/shared.module';
import { SignUpComponent } from './sign-up.component';

import { RouterTestingModule } from '@angular/router/testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { DispatchSpy, newDispatchSpy } from '../../../../test/spy.util';
import { CoreModule } from '../../core/core.module';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../core/model/auth.model';
import { AuthActions } from '../../core/store/actions/auth.actions';
import { AuthState } from '../../core/store/auth/auth.state';

describe('SignUpComponent', () => {
  let fixture: ComponentFixture<SignUpComponent>;
  let loader: HarnessLoader;
  let translateService: TranslateService;
  let store: Store;
  let dispatchSpy: DispatchSpy;
  const emailFormField = () =>
    loader.getHarness(
      MatFormFieldHarness.with({
        selector: '.sign-up-form__fields--email',
      }),
    );

  const passwordFormField = () =>
    loader.getHarness(
      MatFormFieldHarness.with({
        selector: '.sign-up-form__fields--password',
      }),
    );

  const nameFormField = () =>
    loader.getHarness(
      MatFormFieldHarness.with({
        selector: '.sign-up-form__fields--name',
      }),
    );
  const signUpButton = () =>
    fixture.debugElement.query(By.css('.sign-up-form__button'))
      .nativeElement as HTMLButtonElement;

  const toSignInLink = () =>
    fixture.debugElement.query(By.directive(LinkComponent));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [
        await translateTestModule(),
        ReactiveFormsModule,
        RouterTestingModule,
        CoreModule,
        NgxsModule.forRoot([AuthState]),
        NgxsRouterPluginModule.forRoot(),
        SharedModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    translateService = TestBed.inject(TranslateService);
    store = TestBed.inject(Store);
    dispatchSpy = newDispatchSpy(store);
    fixture.detectChanges();
  });

  it('displays translated sign up title', () => {
    const heading = fixture.debugElement.query(By.directive(HeadingComponent))
      .nativeElement as HTMLElement;
    expect(heading.innerText).toEqual(
      translateService.instant(AuthTranslationKeys.SIGN_UP_TITLE),
    );
  });
  it('displays translated email field label', async () => {
    const emailField = await emailFormField();
    expect(await emailField.getLabel()).toContain(
      translateService.instant(AuthTranslationKeys.ENTER_YOUR_EMAIL),
    );
  });
  it('displays translated password field label', async () => {
    const passwordField = await passwordFormField();
    expect(await passwordField.getLabel()).toContain(
      translateService.instant(AuthTranslationKeys.ENTER_YOUR_PASSWORD),
    );
  });
  it('displays translated name field label', async () => {
    const nameField = await nameFormField();
    expect(await nameField.getLabel()).toContain(
      translateService.instant(AuthTranslationKeys.ENTER_YOUR_NAME),
    );
  });
  it('displays translated sign up button', () => {
    expect(signUpButton().innerText.trim()).toEqual(
      translateService.instant(AuthTranslationKeys.SIGN_UP),
    );
  });
  it('displays translated link to sign in', () => {
    const { nativeElement } = toSignInLink();

    expect((nativeElement as HTMLElement).innerText).toEqual(
      translateService.instant(AuthTranslationKeys.ALREADY_HAVE_ACCOUNT),
    );
  });
  it('on already have an account navigates to sign in', () => {
    const { componentInstance } = toSignInLink();

    <LinkComponent>componentInstance.clicked.emit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToSignIn(),
    );
  });
  it('disables sign up button if form is invalid', async () => {
    const emailFormEl = await emailFormField();
    const passwordFormEl = await passwordFormField();
    const emailInput = (await emailFormEl.getControl()) as MatInputHarness;
    const passwordInput = (await passwordFormEl.getControl()) as MatInputHarness;

    expect(signUpButton().disabled).toEqual(true);

    await emailInput.setValue('maciek@gmail.com');
    await emailInput.blur();
    expect(signUpButton().disabled).toEqual(true);

    await emailInput.setValue('');
    await passwordInput.setValue('foo@dasddasds');
    await passwordInput.blur();
    expect(signUpButton().disabled).toEqual(true);
  });
  it('shows invalid email error if email input is invalid', async () => {
    const emailFormEl = await emailFormField();
    const emailInput = (await emailFormEl.getControl()) as MatInputHarness;
    await emailInput.setValue('invalidemail');
    await emailInput.blur();
    expect(await emailFormEl.getTextErrors()).toEqual([
      translateService.instant(FormErrorKeys.EMAIL),
    ]);
  });
  it('shows invalid password error if password is too long', async () => {
    const passwordField = await passwordFormField();
    const passwordInput = (await passwordField.getControl()) as MatInputHarness;
    await passwordInput.setValue('r32n3o2dn3o2ndo32ndo32nd239hd32d32d23');
    await passwordInput.blur();
    expect(await passwordField.getTextErrors()).toEqual([
      translateService.instant(FormErrorKeys.MAX_LENGTH, {
        length: PASSWORD_MAX_LENGTH,
      }),
    ]);
  });
  it('shows invalid password error if password is too short', async () => {
    const passwordField = await passwordFormField();
    const passwordInput = (await passwordField.getControl()) as MatInputHarness;
    await passwordInput.setValue('333');
    await passwordInput.blur();
    expect(await passwordField.getTextErrors()).toEqual([
      translateService.instant(FormErrorKeys.MIN_LENGTH, {
        length: PASSWORD_MIN_LENGTH,
      }),
    ]);
  });
  it('calls auth service on sign up and navigates to sign in page', async () => {
    dispatchSpy.and.returnValues(of({}), of({}));
    const email = 'andrew@gmail.com';
    const name = 'Maciek';
    const password = 'someOkPasssword333';
    const emailFormEl = await emailFormField();
    const emailInput = (await emailFormEl.getControl()) as MatInputHarness;
    const passwordField = await passwordFormField();
    const passwordInput = (await passwordField.getControl()) as MatInputHarness;
    const nameInputField = await nameFormField();
    const nameInput = (await nameInputField.getControl()) as MatInputHarness;

    await emailInput.setValue(email);
    await emailInput.blur();

    await passwordInput.setValue(password);
    await emailInput.blur();

    await nameInput.setValue(name);
    await nameInput.blur();

    signUpButton().click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.Register(name, email, password),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AuthActions.NavigateToSignIn(),
    );
  });
});
