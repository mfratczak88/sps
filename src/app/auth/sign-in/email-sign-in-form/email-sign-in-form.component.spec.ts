import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSignInFormComponent } from './email-sign-in-form.component';

describe('EmailSignInFormComponent', () => {
  let component: EmailSignInFormComponent;
  let fixture: ComponentFixture<EmailSignInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSignInFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSignInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
