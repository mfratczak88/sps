import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendAccountActivationComponent } from './resend-account-activation.component';

describe('ResendAccountActivationComponent', () => {
  let component: ResendAccountActivationComponent;
  let fixture: ComponentFixture<ResendAccountActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendAccountActivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendAccountActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
