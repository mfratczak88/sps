import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidEmailVerifyLinkComponent } from './invalid-email-verify-link.component';

describe('InvalidEmailVerifyLinkComponent', () => {
  let component: InvalidEmailVerifyLinkComponent;
  let fixture: ComponentFixture<InvalidEmailVerifyLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidEmailVerifyLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidEmailVerifyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
