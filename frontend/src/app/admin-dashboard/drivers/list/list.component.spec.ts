import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListComponent } from './list.component';
import { SharedModule } from '../../../shared/shared.module';
import { translateTestModule } from '../../../../test.utils';
import { DriversQuery } from '../state/drivers.query';
import { DriversService } from '../state/drivers.service';
import { RouterService } from '../../../core/state/router/router.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { mockDriver } from '../../../../../test/driver.utils';
import { of } from 'rxjs';
import { buttonCells } from '../../../../../test/test.util';
import { MatButtonHarness } from '@angular/material/button/testing';
import SpyObj = jasmine.SpyObj;
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Drivers list component', () => {
  let fixture: ComponentFixture<DriversListComponent>;
  let driverQuerySpy: SpyObj<DriversQuery>;
  let driverServiceSpy: SpyObj<DriversService>;
  let routerServiceSpy: SpyObj<RouterService>;
  let loader: HarnessLoader;
  const driversList = [
    { ...mockDriver, parkingLotCount: mockDriver.parkingLotIds.length },
  ];

  beforeEach(async () => {
    driverQuerySpy = jasmine.createSpyObj('DriversQuery', [
      'selectLoading',
      'selectAll',
    ]);
    driverServiceSpy = jasmine.createSpyObj('DriversService', ['load']);
    routerServiceSpy = jasmine.createSpyObj('RouterService', [
      'toDriverDetails',
    ]);
    await TestBed.configureTestingModule({
      declarations: [DriversListComponent],
      imports: [
        SharedModule,
        await translateTestModule(),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: DriversService, useValue: driverServiceSpy },
        { provide: DriversQuery, useValue: driverQuerySpy },
        { provide: RouterService, useValue: routerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DriversListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    driverQuerySpy.selectLoading.and.returnValue(of(false));
    driverQuerySpy.selectAll.and.returnValue(of(driversList));
  });
  it('Calls load on service on init', async () => {
    fixture.detectChanges();
    expect(driverServiceSpy.load).toHaveBeenCalled();
  });
  it('Navigates to details page on drivers table details button click', async () => {
    fixture.detectChanges();
    const [detailsTableCell] = await buttonCells(loader, 'details');
    const detailsButton = await detailsTableCell.getHarness(MatButtonHarness);
    await detailsButton.click();
    expect(routerServiceSpy.toDriverDetails).toHaveBeenCalledWith(
      mockDriver.id,
    );
  });
});
