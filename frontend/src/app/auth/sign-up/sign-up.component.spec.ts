import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { translateTestModule } from '../../../test.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { HeadingComponent } from '../../shared/components/heading/heading.component';
import {
  AuthTranslationKeys,
  FormErrorKeys,
} from '../../core/translation-keys';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { LinkComponent } from '../../shared/components/link/link.component';
import { AuthService } from '../../core/state/auth/auth.service';
import { RouterService } from '../../core/state/router/router.service';
import { MatInputHarness } from '@angular/material/input/testing';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../core/state/auth/auth.model';
import { of } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('SignUpComponent', () => {
  let fixture: ComponentFixture<SignUpComponent>;
  let loader: HarnessLoader;
  let translateService: TranslateService;
  let authServiceSpy: SpyObj<AuthService>;
  let routerServiceSpy: SpyObj<RouterService>;
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
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerServiceSpy = jasmine.createSpyObj('RouterService', ['toSignIn']);
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [
        await translateTestModule(),
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: RouterService, useValue: routerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);

    loader = TestbedHarnessEnvironment.loader(fixture);
    translateService = TestBed.inject(TranslateService);
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
    <LinkComponent>componentInstance.click.emit();
    expect(routerServiceSpy.toSignIn).toHaveBeenCalled();
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
    authServiceSpy.register.and.returnValue(of(void 0));
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

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      name,
      email,
      password,
    });
    expect(routerServiceSpy.toSignIn).toHaveBeenCalled();
  });
});
