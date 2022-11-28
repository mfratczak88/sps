import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingLotsTableComponent } from './parking-lots-table.component';
import { SharedModule } from '../../shared.module';
import { translateTestModule } from '../../../../test.utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ParkingLotsTableComponent', () => {
  let component: ParkingLotsTableComponent;
  let fixture: ComponentFixture<ParkingLotsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParkingLotsTableComponent],
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        await translateTestModule(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParkingLotsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
