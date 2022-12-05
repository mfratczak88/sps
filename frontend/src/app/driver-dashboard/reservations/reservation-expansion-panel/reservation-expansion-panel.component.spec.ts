import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationExpansionPanelComponent } from './reservation-expansion-panel.component';

describe('ReservationExpansionPanelComponent', () => {
  let component: ReservationExpansionPanelComponent;
  let fixture: ComponentFixture<ReservationExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationExpansionPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
