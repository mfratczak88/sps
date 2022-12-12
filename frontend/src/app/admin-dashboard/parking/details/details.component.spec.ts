import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import { SharedModule } from '../../../shared/shared.module';
import { translateTestModule } from '../../../../test.utils';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import SpyObj = jasmine.SpyObj;
import { ParkingLotQuery } from '../state/parking-lot.query';
import { ParkingLotService } from '../state/parking-lot.service';
import { RouterQuery } from '../../../core/state/router/router.query';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { mockParkingLots } from '../../../../../test/driver.utils';
import { EMPTY, NEVER, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ChangeHoursDialogComponent } from '../change-hours-dialog/change-hours-dialog.component';
import { ChangeCapacityDialogComponent } from '../change-capacity-dialog/change-capacity-dialog.component';

describe('Parking lot details spec', () => {
  let fixture: ComponentFixture<DetailsComponent>;
  let parkingLotQuerySpy: SpyObj<ParkingLotQuery>;
  let parkingLotServiceSpy: SpyObj<ParkingLotService>;
  let routerQuerySpy: SpyObj<RouterQuery>;
  let dialogSpy: SpyObj<MatDialog>;
  let dialogRefSpy: SpyObj<MatDialogRef<any>>;

  const activeParkingLot = mockParkingLots[0];

  const changeHoursButton = () =>
    fixture.debugElement.query(By.css('.change-hours-button'))
      .nativeElement as HTMLButtonElement;

  const changeCapacityButton = () =>
    fixture.debugElement.query(By.css('.edit-capacity-button'))
      .nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    parkingLotServiceSpy = jasmine.createSpyObj('ParkingLotService', [
      'select',
      'changeOperationHours',
      'changeCapacity',
    ]);
    parkingLotQuerySpy = jasmine.createSpyObj('ParkingLotQuery', [
      'active$',
      'selectLoading',
    ]);
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['afterClosed']);
    dialogSpy = jasmine.createSpyObj('Dialog', ['open']);
    routerQuerySpy = jasmine.createSpyObj('RouterQuery', ['parkingLotId']);
    await TestBed.configureTestingModule({
      declarations: [DetailsComponent],
      imports: [
        SharedModule,
        await translateTestModule(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ParkingLotQuery, useValue: parkingLotQuerySpy },
        { provide: ParkingLotService, useValue: parkingLotServiceSpy },
        { provide: RouterQuery, useValue: routerQuerySpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    routerQuerySpy.parkingLotId.and.returnValue(activeParkingLot.id);
    parkingLotQuerySpy.active$.and.returnValue(of(activeParkingLot));
    parkingLotQuerySpy.selectLoading.and.returnValue(of(false));
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

    changeCapacityButton().click();

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeCapacityDialogComponent, {
      data: activeParkingLot,
    });
    expect(parkingLotServiceSpy.changeCapacity).not.toHaveBeenCalled();
  });
  it('On capacity dialog close with actual value calls service', () => {
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(55));
    parkingLotServiceSpy.changeCapacity.and.returnValue(EMPTY);

    changeCapacityButton().click();

    expect(dialogSpy.open).toHaveBeenCalledWith(ChangeCapacityDialogComponent, {
      data: activeParkingLot,
    });
    expect(parkingLotServiceSpy.changeCapacity).toHaveBeenCalledWith(
      55,
      activeParkingLot.id,
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

    changeHoursButton().click();

    expect(parkingLotServiceSpy.changeOperationHours).not.toHaveBeenCalled();
  });
  it('On close hours dialog with actual hours it calls service', async () => {
    const hours = {
      hourFrom: 10,
      hourTo: 12,
    };
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(hours));
    parkingLotServiceSpy.changeOperationHours.and.returnValue(EMPTY);

    changeHoursButton().click();

    expect(parkingLotServiceSpy.changeOperationHours).toHaveBeenCalledWith(
      hours,
      activeParkingLot.id,
    );
  });
});
