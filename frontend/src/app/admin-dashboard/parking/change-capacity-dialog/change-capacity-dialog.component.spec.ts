import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCapacityDialogComponent } from './change-capacity-dialog.component';

describe('ChangeCapacityDialogComponent', () => {
  let component: ChangeCapacityDialogComponent;
  let fixture: ComponentFixture<ChangeCapacityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeCapacityDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeCapacityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
