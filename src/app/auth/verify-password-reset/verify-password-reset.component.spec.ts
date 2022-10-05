import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPasswordResetComponent } from './verify-password-reset.component';

describe('VerifyPasswordResetComponent', () => {
  let component: VerifyPasswordResetComponent;
  let fixture: ComponentFixture<VerifyPasswordResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyPasswordResetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
