import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidAuthLinkComponent } from './invalid-auth-link.component';

describe('InvalidAuthLinkComponent', () => {
  let component: InvalidAuthLinkComponent;
  let fixture: ComponentFixture<InvalidAuthLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvalidAuthLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidAuthLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
