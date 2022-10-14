import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidAuthLinkComponent } from './invalid-auth-link.component';
import { RouterService } from '../../core/state/router/router.service';
import { AuthActionMode } from '../../core/state/auth/auth.model';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TranslateTestingModule } from 'ngx-translate-testing';
import SpyObj = jasmine.SpyObj;
import { RouterQuery } from '../../core/state/router/router.query';

describe('InvalidAuthLinkComponent', () => {
  let fixture: ComponentFixture<InvalidAuthLinkComponent>;
  let routerServiceSpy: SpyObj<RouterService>;
  let routerQuerySpy: SpyObj<RouterQuery>;

  beforeEach(async () => {
    routerQuerySpy = jasmine.createSpyObj('RouterQuery', [
      'authActionModeParam',
    ]);
    routerServiceSpy = jasmine.createSpyObj('RouterService', [
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
        { provide: RouterService, useValue: routerServiceSpy },
        { provide: RouterQuery, useValue: routerQuerySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvalidAuthLinkComponent);
  });

  it('Navigates to 404 if no mode query param in URL', () => {
    routerQuerySpy.authActionModeParam.and.returnValue(null);
    fixture.detectChanges();
    expect(routerServiceSpy.to404).toHaveBeenCalled();
  });
  it('Navigates to 404 if mode query param is invalid', () => {
    routerQuerySpy.authActionModeParam.and.returnValue('foo' as AuthActionMode);
    fixture.detectChanges();
    expect(routerServiceSpy.to404).toHaveBeenCalled();
  });
  it('If mode === resetPassword, button navigates to passwordReset', () => {
    routerQuerySpy.authActionModeParam.and.returnValue(
      AuthActionMode.RESET_PASSWORD,
    );
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    button.click();
    expect(routerServiceSpy.to404).not.toHaveBeenCalled();
    expect(routerServiceSpy.toPasswordReset).toHaveBeenCalled();
  });
});
