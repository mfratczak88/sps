import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverDetailsComponent } from './details.component';
import { SharedModule } from '../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { translateTestModule } from '../../../../test.utils';
import { RouterQuery } from '../../../core/state/router/router.query';
import { DriversService } from '../state/drivers.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DriversQuery } from '../state/drivers.query';
import { Driver } from '../state/drivers.model';
import { EMPTY, lastValueFrom, NEVER, Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ParkingLotsTableComponent } from '../../../shared/components/parking-lots-table/parking-lots-table.component';
import { AssignParkingLotDialogComponent } from '../assign-parking-lot-dialog/assign-parking-lot-dialog.component';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { mockDriver, mockParkingLots } from '../../../../../test/driver.utils';
import { buttonCells } from '../../../../../test/test.util';
import SpyObj = jasmine.SpyObj;

describe('Driver details component', () => {
  let fixture: ComponentFixture<DriverDetailsComponent>;
  let routerQuerySpy: SpyObj<RouterQuery>;
  let driversServiceSpy: SpyObj<DriversService>;
  let dialogSpy: SpyObj<MatDialog>;
  let driversQuerySpy: SpyObj<DriversQuery>;
  let dialogRefSpy: SpyObj<MatDialogRef<AssignParkingLotDialogComponent>>;
  let loader: HarnessLoader;

  const parkingLots = mockParkingLots;
  const driver: Driver = {
    ...mockDriver,
    parkingLots: [parkingLots[0]],
    parkingLotCount: 1,
  };

  const assignButton = () =>
    fixture.debugElement.query(By.css('.assign-button'))
      ?.nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    driversQuerySpy = jasmine.createSpyObj('DriversQuery', [
      'active$',
      'driverUnAssignedParkingLots$',
      'selectLoading',
    ]);
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['afterClosed']);
    driversServiceSpy = jasmine.createSpyObj('DriversService', [
      'assignParkingLot',
      'removeParkingLotAssignment',
      'select',
    ]);
    routerQuerySpy = jasmine.createSpyObj('RouterQuery', ['driverId']);
    dialogSpy = jasmine.createSpyObj('Dialog', ['open', 'afterClosed']);
    await TestBed.configureTestingModule({
      declarations: [DriverDetailsComponent],
      imports: [
        SharedModule,
        NoopAnimationsModule,
        await translateTestModule(),
      ],
      providers: [
        { provide: DriversService, useValue: driversServiceSpy },
        { provide: DriversQuery, useValue: driversQuerySpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: RouterQuery, useValue: routerQuerySpy },
      ],
    }).compileComponents();
    routerQuerySpy.driverId.and.returnValue(driver.id);
    driversQuerySpy.active$.and.returnValue(of(driver));
    fixture = TestBed.createComponent(DriverDetailsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
  it('Displays current driver details', async () => {
    fixture.detectChanges();

    const [email, name] = fixture.debugElement
      .queryAll(By.css('.details-panel__section--item'))
      .map(div => div.children[1].nativeElement as HTMLSpanElement);

    expect(email.innerText).toEqual(driver.email);
    expect(name.innerText).toEqual(driver.name);
  });
  it('Displays driver assigned parking lots', async () => {
    fixture.detectChanges();

    const parkingLotsTable = fixture.debugElement.query(
      By.css('sps-parking-lots-table'),
    ).componentInstance as ParkingLotsTableComponent;
    const displayedParkingLots = await lastValueFrom(
      parkingLotsTable.parkingLots$,
    );

    expect(displayedParkingLots).toEqual(driver.parkingLots);
  });
  it('Assign parking lot - opens up dialog on button click providing unassigned lots obs$', () => {
    // given
    driversQuerySpy.driverUnAssignedParkingLots$.and.returnValue(
      of([parkingLots[1]]),
    );
    dialogRefSpy.afterClosed.and.returnValue(NEVER);
    dialogSpy.open.and.returnValue(dialogRefSpy);
    fixture.detectChanges();

    // when
    assignButton().click();

    // then
    const [componentClass, data] = dialogSpy.open.calls.mostRecent().args;
    expect(componentClass).toEqual(AssignParkingLotDialogComponent);
    (data?.data as Observable<ParkingLot[]>).subscribe(lots => {
      expect(lots[0]).toEqual(parkingLots[1]);
      expect(lots.length).toEqual(1);
    });
  });
  it('Assign parking lot - hides button if all of the lots are assigned to driver', () => {
    driversQuerySpy.driverUnAssignedParkingLots$.and.returnValue(of([]));
    driversQuerySpy.active$.and.returnValue(
      of({
        ...driver,
        parkingLots,
      }),
    );
    fixture.detectChanges();
    const assignLotButton = assignButton();
    expect(assignLotButton).toBeFalsy();
  });
  it('Assign parking lot - calls service with selected lot id', async () => {
    // given
    const unAssignedParkingLot = parkingLots[1];
    dialogSpy.open.and.returnValue(dialogRefSpy);
    driversQuerySpy.driverUnAssignedParkingLots$.and.returnValue(
      of([unAssignedParkingLot]),
    );
    dialogRefSpy.afterClosed.and.returnValue(of(unAssignedParkingLot.id));
    fixture.detectChanges();
    driversServiceSpy.assignParkingLot.and.returnValue(EMPTY);

    // when
    assignButton().click();

    // then
    expect(driversServiceSpy.assignParkingLot).toHaveBeenCalledWith(
      driver.id,
      unAssignedParkingLot.id,
    );
  });
  it('Assign parking lot - does not call service if lot has not been selected', async () => {
    // given
    const unAssignedParkingLot = parkingLots[1];
    dialogSpy.open.and.returnValue(dialogRefSpy);
    driversQuerySpy.driverUnAssignedParkingLots$.and.returnValue(
      of([unAssignedParkingLot]),
    );
    dialogRefSpy.afterClosed.and.returnValue(of(''));
    fixture.detectChanges();

    // when
    assignButton().click();

    // then
    expect(driversServiceSpy.assignParkingLot).not.toHaveBeenCalled();
  });

  it('Calls remove parking lot on clicking button in assigned lots table', async () => {
    const [removeAssignmentButtonCell] = await buttonCells(loader, 'remove');
    driversServiceSpy.removeParkingLotAssignment.and.returnValue(of(undefined));
    const button = await removeAssignmentButtonCell.getHarness(
      MatButtonHarness,
    );
    await button.click();
    expect(driversServiceSpy.removeParkingLotAssignment).toHaveBeenCalledWith({
      driverId: driver.id,
      parkingLotId: driver.parkingLots[0].id,
    });
  });
});
