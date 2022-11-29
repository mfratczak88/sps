import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCapacityDialogComponent } from './change-capacity-dialog.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ParkingLotAdminModel } from '../../../core/model/parking-lot.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputHarness } from '@angular/material/input/testing';
import { mockParkingLots } from '../../../../../test/driver.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { translateTestModule } from '../../../../test.utils';
import { By } from '@angular/platform-browser';
import SpyObj = jasmine.SpyObj;

describe('ChangeCapacityDialogComponent', () => {
  let fixture: ComponentFixture<ChangeCapacityDialogComponent>;
  let loader: HarnessLoader;
  let parkingLot: ParkingLotAdminModel;
  let dialogRefSpy: SpyObj<MatDialogRef<ChangeCapacityDialogComponent>>;

  const inputHarness = async () => {
    return loader.getHarness(MatInputHarness);
  };
  const actionButton = () => {
    return fixture.debugElement.query(By.css('.action-button'))
      .nativeElement as HTMLButtonElement;
  };

  const cancelButton = () => {
    return fixture.debugElement.query(By.css('.cancel-button'))
      .nativeElement as HTMLButtonElement;
  };
  beforeEach(async () => {
    parkingLot = mockParkingLots[0];
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ChangeCapacityDialogComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule,
        await translateTestModule(),
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: parkingLot },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeCapacityDialogComponent);

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
  it('Disables action button when capacity is not set', async () => {
    const button = actionButton();
    expect(button.disabled).toEqual(true);
  });
  it('Disables action button when capacity is the same', async () => {
    const input = await inputHarness();
    await input.setValue(String(parkingLot.capacity));
    fixture.detectChanges();
    const button = actionButton();

    expect(button.disabled).toEqual(true);
  });
  it('Sends falsy value on cancel', async () => {
    cancelButton().click();
    expect(dialogRefSpy.close.calls.mostRecent().args[0]).toBeFalsy();
  });
  it('Sends new capacity value on action button', async () => {
    const input = await inputHarness();
    await input.setValue(String(parkingLot.capacity + 20));

    actionButton().click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(parkingLot.capacity + 20);
  });
});
