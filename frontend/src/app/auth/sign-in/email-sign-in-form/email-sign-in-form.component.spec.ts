import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSignInFormComponent } from './email-sign-in-form.component';
import { translateTestModule } from '../../../../test.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { By } from '@angular/platform-browser';
import { MatInputHarness } from '@angular/material/input/testing';
import { LinkComponent } from '../../../shared/components/link/link.component';

import {
  AuthTranslationKeys,
  FormErrorKeys,
} from '../../../core/translation-keys';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../../../core/model/auth.model';

describe('EmailSignInFormComponent', () => {
  let fixture: ComponentFixture<EmailSignInFormComponent>;
  let translateService: TranslateService;
  let loader: HarnessLoader;

  const emailIFormElement = () =>
    loader.getHarness(
      MatFormFieldHarness.with({
        selector: '.form__fields--email',
      }),
    );
  const passwordFormElement = () =>
    loader.getHarness(
      MatFormFieldHarness.with({
        selector: '.form__fields--password',
      }),
    );

  const submitButton = () =>
    fixture.debugElement.query(By.css('.form__button'))
      .nativeElement as HTMLButtonElement;

  const noAccountLink = () =>
    fixture.debugElement.query(By.css('.form__footer--dont-have-account'));

  const forgotPasswordLink = () =>
    fixture.debugElement.query(By.css('.form__footer--forgot-password'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailSignInFormComponent],
      imports: [
        await translateTestModule(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailSignInFormComponent);
    translateService = TestBed.inject(TranslateService);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('translates email form label', async () => {
    const emailField = await emailIFormElement();
    const label = await emailField.getLabel();
    expect(label).toContain(
      translateService.instant(AuthTranslationKeys.ENTER_YOUR_EMAIL),
    );
  });
  it('translates password form label', async () => {
    const passwordField = await passwordFormElement();
    const label = await passwordField.getLabel();
    expect(label).toContain(
      translateService.instant(AuthTranslationKeys.ENTER_YOUR_PASSWORD),
    );
  });
  it('translates submit button text', async () => {
    expect(submitButton().innerText).toEqual(
      translateService.instant(AuthTranslationKeys.SIGN_IN),
    );
  });
  it('translates dont have account link', () => {
    const { nativeElement: link } = noAccountLink();
    expect(link.innerText).toEqual(
      translateService.instant(AuthTranslationKeys.DONT_HAVE_AN_ACCOUNT),
    );
  });
  it('translates forgot password link', () => {
    const { nativeElement: link } = forgotPasswordLink();
    expect(link.innerText).toEqual(
      translateService.instant(AuthTranslationKeys.FORGOT_PASSWORD),
    );
  });
  it('disables submit button when at least one input is empty', async () => {
    const emailFormEl = await emailIFormElement();
    const passwordFormEl = await passwordFormElement();
    const emailInput = (await emailFormEl.getControl()) as MatInputHarness;
    const passwordInput = (await passwordFormEl.getControl()) as MatInputHarness;

    expect(submitButton().disabled).toEqual(true);

    await emailInput.setValue('maciek@gmail.com');
    await emailInput.blur();
    expect(submitButton().disabled).toEqual(true);

    await emailInput.setValue('');
    await passwordInput.setValue('foo@dasddasds');
    await passwordInput.blur();
    expect(submitButton().disabled).toEqual(true);
  });
  it('emits on no account click', () => {
    let emitted = false;
    fixture.componentInstance.noAccount.subscribe(() => (emitted = true));
    const { componentInstance } = noAccountLink();
    (componentInstance as LinkComponent).click.emit();
    expect(emitted).toEqual(true);
  });
  it('emits on forgot password link click', () => {
    let emitted = false;
    fixture.componentInstance.forgotPassword.subscribe(() => (emitted = true));
    const { componentInstance } = forgotPasswordLink();
    (componentInstance as LinkComponent).click.emit();
    expect(emitted).toEqual(true);
  });
  it('shows error if email address is invalid', async () => {
    const emailEl = await emailIFormElement();
    const emailInput = (await emailEl.getControl()) as MatInputHarness;
    await emailInput.setValue('foo');
    await emailInput.blur();
    expect(await emailEl.getTextErrors()).toEqual([
      translateService.instant(FormErrorKeys.EMAIL),
    ]);
  });
  it('shows error if password is too short', async () => {
    const passwordElement = await passwordFormElement();
    const passwordInput = (await passwordElement.getControl()) as MatInputHarness;
    await passwordInput.setValue('bar');
    await passwordInput.blur();
    expect(await passwordElement.getTextErrors()).toEqual([
      translateService.instant(FormErrorKeys.MIN_LENGTH, {
        length: PASSWORD_MIN_LENGTH,
      }),
    ]);
  });
  it('shows error if password length is too long', async () => {
    const passwordElement = await passwordFormElement();
    const passwordInput = (await passwordElement.getControl()) as MatInputHarness;
    await passwordInput.setValue(
      '123fdsaf34dnewocnoer32r23r32rnfodsnfodsnfor3o23rn3or',
    );
    await passwordInput.blur();
    expect(await passwordElement.getTextErrors()).toEqual([
      translateService.instant(FormErrorKeys.MAX_LENGTH, {
        length: PASSWORD_MAX_LENGTH,
      }),
    ]);
  });
});
