import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DriverDetailsComponent } from './details.component';
import { SharedModule } from '../../../shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { translateTestModule } from '../../../../test.utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { lastValueFrom, NEVER, Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ParkingLotsTableComponent } from '../../../shared/components/parking-lots-table/parking-lots-table.component';
import { AssignParkingLotDialogComponent } from '../assign-parking-lot-dialog/assign-parking-lot-dialog.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { mockDriver, mockParkingLots } from '../../../../../test/driver.utils';
import { buttonCells } from '../../../../../test/test.util';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { DriversState } from '../../../core/store/drivers/drivers.state';
import { ParkingLotsState } from '../../../core/store/parking-lot/parking-lot.state';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { DispatchSpy, newDispatchSpy } from '../../../../../test/spy.util';
import { mapToObjectWithIds } from '../../../core/util';
import { setDriver } from '../../../../../test/store.util';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';

describe('Driver details component', () => {
  let fixture: ComponentFixture<DriverDetailsComponent>;
  let dialogSpy: SpyObj<MatDialog>;
  let dialogRefSpy: SpyObj<MatDialogRef<AssignParkingLotDialogComponent>>;
  let loader: HarnessLoader;
  let store: Store;
  let dispatchSpy: DispatchSpy;

  const parkingLots = mockParkingLots;
  const driver = {
    ...mockDriver,
    parkingLotIds: [parkingLots[0].id, parkingLots[1].id],
  };

  const assignButton = () =>
    fixture.debugElement.query(By.css('.assign-button'))
      ?.nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['afterClosed']);

    dialogSpy = jasmine.createSpyObj('Dialog', ['open', 'afterClosed']);
    await TestBed.configureTestingModule({
      declarations: [DriverDetailsComponent],
      imports: [
        SharedModule,
        NoopAnimationsModule,
        await translateTestModule(),
        RouterTestingModule,
        HttpClientModule,
        NgxsModule.forRoot([DriversState, ParkingLotsState]),
        NgxsRouterPluginModule.forRoot(),
      ],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    }).compileComponents();
    fixture = TestBed.createComponent(DriverDetailsComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    store = TestBed.inject(Store);
    dispatchSpy = newDispatchSpy(store);
    store.reset({
      ...store.snapshot(),
      parkingLots: {
        loading: false,
        entities: mapToObjectWithIds(parkingLots),
      },
      drivers: {
        loading: false,
        entities: {
          [mockDriver.id]: mockDriver,
        },
        selectedId: mockDriver.id,
      },
      router: {
        state: {
          params: {
            driverId: mockDriver.id,
          },
        },
      },
    });
  });
  it('Displays current driver details', async () => {
    setDriver(store, { ...mockDriver, parkingLotIds: [parkingLots[0].id] });
    fixture.detectChanges();

    const [email, name] = fixture.debugElement
      .queryAll(By.css('.details-panel__section--item'))
      .map(div => div.children[1].nativeElement as HTMLSpanElement);

    expect(email.innerText).toEqual(driver.email);
    expect(name.innerText).toEqual(driver.name);
  });
  it('Displays driver assigned parking lots', () => {
    fixture.detectChanges();
    const parkingLotsTable = fixture.debugElement.query(
      By.css('sps-parking-lots-table'),
    ).componentInstance as ParkingLotsTableComponent;

    parkingLotsTable.parkingLots$.subscribe(lots =>
      expect(lots).toEqual([...parkingLots]),
    );
  });
  it('Assign parking lot - opens up dialog on button click providing unassigned lots', () => {
    // given
    setDriver(store, { ...mockDriver, parkingLotIds: [parkingLots[0].id] });
    dialogRefSpy.afterClosed.and.returnValue(NEVER);
    dialogSpy.open.and.returnValue(dialogRefSpy);
    fixture.detectChanges();

    // when
    assignButton().click();

    // then
    const [
      componentClass,
      dialogConfig,
    ] = dialogSpy.open.calls.mostRecent().args;
    expect(componentClass).toEqual(AssignParkingLotDialogComponent);
    expect(dialogConfig?.data).toEqual([parkingLots[1]]);
  });
  it('Assign parking lot - hides button if all of the lots are assigned to driver', () => {
    setDriver(store, {
      ...driver,
      parkingLotIds: parkingLots.map(({ id }) => id),
    });
    fixture.detectChanges();
    const assignLotButton = assignButton();
    expect(assignLotButton).toBeFalsy();
  });
  it('Assign parking lot - calls service with selected lot id', async () => {
    // given
    setDriver(store, { ...mockDriver, parkingLotIds: [parkingLots[0].id] });
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogRefSpy.afterClosed.and.returnValue(of(parkingLots[1].id));
    fixture.detectChanges();
    dispatchSpy.and.returnValues(of({}), of({}));

    // when
    assignButton().click();

    // then
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AdminActions.AssignParkingLot(mockDriver.id, parkingLots[1].id),
    );
  });
  it('Assign parking lot - does not call service if lot has not been selected', async () => {
    // given
    dialogSpy.open.and.returnValue(dialogRefSpy);
    setDriver(store, { ...mockDriver, parkingLotIds: [parkingLots[0].id] });
    dialogRefSpy.afterClosed.and.returnValue(of(''));
    fixture.detectChanges();

    // when
    assignButton().click();

    // then
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      new AdminActions.AssignParkingLot(driver.id, parkingLots[1].id),
    );
  });

  it('Calls remove parking lot on clicking button in assigned lots table', async () => {
    const [removeAssignmentButtonCell] = await buttonCells(loader, 'remove');
    const button = await removeAssignmentButtonCell.getHarness(
      MatButtonHarness,
    );
    await button.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AdminActions.RemoveParkingLotAssignment(
        mockDriver.id,
        parkingLots[0].id,
      ),
    );
  });
});
