import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionCodeComponent } from './action-code.component';

describe('ActionCodeComponent', () => {
  let component: ActionCodeComponent;
  let fixture: ComponentFixture<ActionCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
