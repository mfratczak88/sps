import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { EMPTY, NEVER, of } from 'rxjs';
import { mockParkingLots } from '../../../../../test/driver.utils';
import { DispatchSpy, newDispatchSpy } from '../../../../../test/spy.util';
import { setParkingLot } from '../../../../../test/store.util';
import { translateTestModule } from '../../../../test.utils';
import { CoreModule } from '../../../core/core.module';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import { ParkingLotsState } from '../../../core/store/parking-lot/parking-lot.state';
import { SharedModule } from '../../../shared/shared.module';
import { ChangeCapacityDialogComponent } from '../change-capacity-dialog/change-capacity-dialog.component';
import { ChangeHoursDialogComponent } from '../change-hours-dialog/change-hours-dialog.component';
import { DetailsComponent } from './details.component';
import SpyObj = jasmine.SpyObj;

describe('Parking lot details spec', () => {
  let fixture: ComponentFixture<DetailsComponent>;
  let dialogSpy: SpyObj<MatDialog>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // Just a spy
  let dialogRefSpy: SpyObj<MatDialogRef<any>>;
  let store: Store;
  let dispatchSpy: DispatchSpy;
  const [activeParkingLot] = mockParkingLots;
  const changeHoursButton = () =>
    fixture.debugElement.query(By.css('.change-hours-button'))
      .nativeElement as HTMLButtonElement;

  const changeCapacityButton = () =>
    fixture.debugElement.query(By.css('.edit-capacity-button'))
      .nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['afterClosed']);
    dialogSpy = jasmine.createSpyObj('Dialog', ['open']);
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [
        SharedModule,
        CoreModule,
        await translateTestModule(),
        RouterTestingModule,
        NgxsModule.forRoot([ParkingLotsState]),
        NgxsRouterPluginModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    store = TestBed.inject(Store);
    dispatchSpy = newDispatchSpy(store);
    setParkingLot(store, activeParkingLot);
    fixture.detectChanges();
  });

  it('On capacity change button opens dialog', async () => {
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(NEVER);

    changeCapacityButton().click();

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeCapacityDialogComponent, {
      data: activeParkingLot,
    });
  });
  it('When capacity dialog returns falsy value it does not do anything', async () => {
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(null));
    dispatchSpy.calls.reset();
    changeCapacityButton().click();

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeCapacityDialogComponent, {
      data: activeParkingLot,
    });
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
  it('On capacity dialog close with actual value calls service', () => {
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(55));
    dispatchSpy.and.returnValue(of({}));

    changeCapacityButton().click();

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeCapacityDialogComponent, {
      data: activeParkingLot,
    });
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AdminActions.ChangeCapacity(55, activeParkingLot.id),
    );
  });
  it('On change hours button press it opens change hours dialog', async () => {
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(NEVER);

    changeHoursButton().click();

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeHoursDialogComponent, {
      data: activeParkingLot,
    });
  });
  it('On close hours dialog with falsy value it does not do anything', async () => {
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(EMPTY);
    dispatchSpy.calls.reset();
    changeHoursButton().click();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
  it('On close hours dialog with actual hours it calls service', async () => {
    const hours = {
      hourFrom: 10,
      hourTo: 12,
    };
    const { hourFrom, hourTo } = hours;
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(hours));
    dispatchSpy.calls.reset();
    dispatchSpy.and.returnValue(of({}));
    changeHoursButton().click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new AdminActions.ChangeOperationHours(
        hourFrom,
        hourTo,
        activeParkingLot.id,
      ),
    );
  });
});
