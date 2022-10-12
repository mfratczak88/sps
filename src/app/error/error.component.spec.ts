import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { translateTestModule } from '../../test.utils';
import SpyObj = jasmine.SpyObj;
import { NavigationService } from '../core/service/navigation.service';
import { By } from '@angular/platform-browser';

describe('ErrorComponent', () => {
  let fixture: ComponentFixture<ErrorComponent>;
  let navigationServiceSpy: SpyObj<NavigationService>;
  beforeEach(async () => {
    navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'toRoot',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      imports: [await translateTestModule()],
      providers: [
        { provide: NavigationService, useValue: navigationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    fixture.detectChanges();
  });

  it('on to home page navigates to root url', () => {
    const button = fixture.debugElement.query(By.css('.error-page__to-home'))
      .nativeElement as HTMLButtonElement;
    button.click();
    expect(navigationServiceSpy.toRoot).toHaveBeenCalled();
  });
});
