import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidAuthLinkComponent } from './invalid-auth-link.component';
import { NavigationService } from '../../core/service/navigation.service';
import { AuthActionMode } from '../../core/state/auth/auth.model';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TranslateTestingModule } from 'ngx-translate-testing';
import SpyObj = jasmine.SpyObj;

describe('InvalidAuthLinkComponent', () => {
  let fixture: ComponentFixture<InvalidAuthLinkComponent>;
  let navigationServiceSpy: SpyObj<NavigationService>;
  beforeEach(async () => {
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'authActionModeFromQueryParams',
      'to404',
      'toPasswordReset',
    ]);
    await TestBed.configureTestingModule({
      declarations: [InvalidAuthLinkComponent],
      imports: [
        TranslateTestingModule.withTranslations(
          'pl',
          await import('../../../assets/i18n/pl.json'),
        ).withTranslations('en', await import('../../../assets/i18n/en.json')),
        HttpClientModule,
      ],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvalidAuthLinkComponent);
  });

  it('Navigates to 404 if no mode query param in URL', () => {
    navigationServiceSpy.authActionModeFromQueryParams.and.returnValue(null);
    fixture.detectChanges();
    expect(navigationServiceSpy.to404).toHaveBeenCalled();
  });
  it('Navigates to 404 if mode query param is invalid', () => {
    navigationServiceSpy.authActionModeFromQueryParams.and.returnValue('foo');
    fixture.detectChanges();
    expect(navigationServiceSpy.to404).toHaveBeenCalled();
  });
  it('If mode === resetPassword, button navigates to passwordReset', () => {
    navigationServiceSpy.authActionModeFromQueryParams.and.returnValue(
      AuthActionMode.RESET_PASSWORD,
    );
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    button.click();
    expect(navigationServiceSpy.to404).not.toHaveBeenCalled();
    expect(navigationServiceSpy.toPasswordReset).toHaveBeenCalled();
  });
});
