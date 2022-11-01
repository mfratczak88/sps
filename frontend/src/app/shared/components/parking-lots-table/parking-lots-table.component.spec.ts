import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingLotsTableComponent } from './parking-lots-table.component';

describe('ParkingLotsTableComponent', () => {
  let component: ParkingLotsTableComponent;
  let fixture: ComponentFixture<ParkingLotsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkingLotsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingLotsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
