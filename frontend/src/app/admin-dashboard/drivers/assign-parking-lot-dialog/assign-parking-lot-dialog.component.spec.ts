import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignParkingLotDialogComponent } from './assign-parking-lot-dialog.component';

describe('AssignParkingLotDialogComponent', () => {
  let component: AssignParkingLotDialogComponent;
  let fixture: ComponentFixture<AssignParkingLotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignParkingLotDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignParkingLotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
