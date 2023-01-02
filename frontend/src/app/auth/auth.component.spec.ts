import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { By } from '@angular/platform-browser';

describe('AuthComponent', () => {
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    fixture.detectChanges();
  });

  it('Shows logo', () => {
    const logo = fixture.debugElement.query(By.css('.auth__logo--svg'))
      .nativeElement;

    expect(logo).toBeDefined();
  });
});
