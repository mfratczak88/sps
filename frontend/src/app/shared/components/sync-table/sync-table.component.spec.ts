import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncTableComponent } from './sync-table.component';

describe('SyncTableComponent', () => {
  let component: SyncTableComponent;
  let fixture: ComponentFixture<SyncTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
