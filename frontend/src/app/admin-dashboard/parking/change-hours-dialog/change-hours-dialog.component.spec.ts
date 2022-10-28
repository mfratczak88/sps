import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHoursDialogComponent } from './change-hours-dialog.component';

describe('ChangeHoursDialogComponent', () => {
  let component: ChangeHoursDialogComponent;
  let fixture: ComponentFixture<ChangeHoursDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeHoursDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeHoursDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
