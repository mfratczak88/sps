import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../core/state/auth/auth.service';
import { NavigationService } from '../../core/service/navigation.service';
import { HeadingComponent } from '../../shared/components/heading/heading.component';
import { TextComponent } from '../../shared/components/text/text.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { By } from '@angular/platform-browser';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { LinkComponent } from '../../shared/components/link/link.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import SpyObj = jasmine.SpyObj;
import { of } from 'rxjs';
import {
  AuthTranslationKeys,
  FormErrorKeys,
} from '../../core/translation-keys';

describe('PasswordResetComponent', () => {
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authServiceSpy: SpyObj<AuthService>;
  let navigationServiceSpy: SpyObj<NavigationService>;
  let translateService: TranslateService;
  let loader: HarnessLoader;
  const formFieldHarness = () => loader.getHarness(MatFormFieldHarness);
  const inputHarness = async (): Promise<MatInputHarness> => {
    const formField = await loader.getHarness(MatFormFieldHarness);
    return (await formField.getControl()) as MatInputHarness;
  };
  const submitButton = () =>
    fixture.debugElement.query(By.css('.password-reset__form--button'))
      .nativeElement as HTMLButtonElement;
  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'sendResetPasswordEmail',
    ]);
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'toSignIn',
      'toSignUp',
    ]);
    await TestBed.configureTestingModule({
      declarations: [PasswordResetComponent],
      imports: [
        TranslateTestingModule.withTranslations(
          'pl',
          await import('../../../assets/i18n/pl.json'),
        ).withTranslations('en', await import('../../../assets/i18n/en.json')),
        HttpClientModule,
        SharedModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    translateService = TestBed.inject(TranslateService);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('Shows translated form label text', () => {
    const label = fixture.debugElement.query(
      By.css('.password-reset__form--label'),
    ).nativeElement as HTMLLabelElement;
    const expectedText = translateService.instant(
      AuthTranslationKeys.ENTER_EMAIL,
    );
    const actualText = label.innerText;

    expect(actualText).toEqual(expectedText);
  });
  it('Shows translated button text', () => {
    const button = fixture.debugElement.query(
      By.css('.password-reset__form--button'),
    ).nativeElement as HTMLButtonElement;
    const expectedText = translateService.instant(
      AuthTranslationKeys.RESET_BUTTON,
    );
    const actualText = button.textContent?.trim();

    expect(actualText).toEqual(expectedText);
  });
  it('Shows translated heading', () => {
    const heading = fixture.debugElement.query(By.directive(HeadingComponent))
      .nativeElement as HTMLElement;
    const expectedText = translateService.instant(
      AuthTranslationKeys.FORGOT_PASSWORD,
    );
    const actualText = heading.innerText;

    expect(actualText).toEqual(expectedText);
  });
  it('Shows translated body text', () => {
    const heading = fixture.debugElement.query(By.directive(TextComponent))
      .nativeElement as HTMLElement;
    const expectedText = translateService.instant(
      AuthTranslationKeys.WE_CAN_RESET_PASSWORD,
    );
    const actualText = heading.innerText;

    expect(actualText).toEqual(expectedText);
  });
  it('Displays error on invalid email address', async () => {
    const formField = await formFieldHarness();
    const input = await inputHarness();
    await input.setValue('foo');
    await input.blur();
    expect(await formField.getTextErrors()).toEqual([
      translateService.instant(FormErrorKeys.EMAIL),
    ]);
  });
  it('Does not allow to click on the form when email is invalid', async () => {
    const input = await inputHarness();

    await input.setValue('foo');
    await input.blur();
    expect(submitButton().disabled).toEqual(true);
  });
  it('On Remember it? Link navigates to sig in', () => {
    const rememberItLink = fixture.debugElement.query(
      By.css('.password-reset__footer--remember-it'),
    ).componentInstance as LinkComponent;
    rememberItLink.click.emit();
    expect(navigationServiceSpy.toSignIn).toHaveBeenCalled();
  });
  it('On Dont have an account navigates to sign up', () => {
    const rememberItLink = fixture.debugElement.query(
      By.css('.password-reset__footer--no-account'),
    ).componentInstance as LinkComponent;
    rememberItLink.click.emit();
    expect(navigationServiceSpy.toSignUp).toHaveBeenCalled();
  });
  it('Calls sendResetPassword on auth service on submit and navigates to sign in', async () => {
    authServiceSpy.sendResetPasswordEmail.and.returnValue(of(void 0));
    const input = await inputHarness();
    await input.setValue('maciek@gmail.com');
    await input.blur();
    submitButton().click();
    fixture.detectChanges();

    expect(authServiceSpy.sendResetPasswordEmail).toHaveBeenCalledWith(
      'maciek@gmail.com',
    );
    expect(navigationServiceSpy.toSignIn).toHaveBeenCalled();
  });
});
