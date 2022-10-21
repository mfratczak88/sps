import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorComponent } from './error.component';
import { translateTestModule } from '../../test.utils';
import SpyObj = jasmine.SpyObj;
import { RouterService } from '../core/state/router/router.service';
import { By } from '@angular/platform-browser';

describe('ErrorComponent', () => {
  let fixture: ComponentFixture<ErrorComponent>;
  let routerServiceSpy: SpyObj<RouterService>;
  beforeEach(async () => {
    routerServiceSpy = jasmine.createSpyObj('RouterService', ['toRoot']);
    await TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      imports: [await translateTestModule()],
      providers: [{ provide: RouterService, useValue: routerServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    fixture.detectChanges();
  });

  it('on to home page navigates to root url', () => {
    const button = fixture.debugElement.query(By.css('.error-page__to-home'))
      .nativeElement as HTMLButtonElement;
    button.click();
    expect(routerServiceSpy.toRoot).toHaveBeenCalled();
  });
});
