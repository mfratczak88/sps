import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversListComponent } from './list.component';
import { SharedModule } from '../../../shared/shared.module';
import { translateTestModule } from '../../../../test.utils';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { mockDriver } from '../../../../../test/driver.utils';
import { buttonCells } from '../../../../../test/test.util';
import { MatButtonHarness } from '@angular/material/button/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { DriversState } from '../../../core/store/drivers/drivers.state';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { DispatchSpy, newDispatchSpy } from '../../../../../test/spy.util';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import { HttpClientModule } from '@angular/common/http';

describe('Drivers list component', () => {
  let fixture: ComponentFixture<DriversListComponent>;
  let loader: HarnessLoader;
  let store: Store;
  let dispatchSpy: DispatchSpy;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriversListComponent],
      imports: [
        SharedModule,
        HttpClientModule,
        await translateTestModule(),
        NoopAnimationsModule,
        RouterTestingModule,
        NgxsModule.forRoot([DriversState]),
        NgxsRouterPluginModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DriversListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    store = TestBed.inject(Store);
    dispatchSpy = newDispatchSpy(store);
    store.reset({
      ...store.snapshot(),
      drivers: {
        entities: {
          [mockDriver.id]: mockDriver,
        },
        loading: false,
      },
    });
  });
  it('Calls load on service on init', async () => {
    fixture.componentInstance.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(new AdminActions.GetAllDrivers());
  });
  it('Navigates to details page on drivers table details button click', async () => {
    fixture.detectChanges();
    const [detailsTableCell] = await buttonCells(loader, 'details');
    const detailsButton = await detailsTableCell.getHarness(MatButtonHarness);
    await detailsButton.click();
    expect(dispatchSpy).toHaveBeenCalledWith(
      new AdminActions.NavigateToDriverDetails(mockDriver.id),
    );
  });
});
