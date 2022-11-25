import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekdaysFormComponent } from './weekdays-form.component';

describe('WeekdaysFormComponent', () => {
  let component: WeekdaysFormComponent;
  let fixture: ComponentFixture<WeekdaysFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekdaysFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekdaysFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
