import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHoursDialogComponent } from './change-hours-dialog.component';
import { MatInputHarness } from '@angular/material/input/testing';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { mockParkingLots } from '../../../../../test/driver.utils';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import SpyObj = jasmine.SpyObj;
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { translateTestModule } from '../../../../test.utils';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('ChangeHoursDialogComponent', () => {
  let fixture: ComponentFixture<ChangeHoursDialogComponent>;
  let loader: HarnessLoader;
  let parkingLot: ParkingLot;
  let dialogRefSpy: SpyObj<MatDialogRef<ChangeHoursDialogComponent>>;
  const inputHarnesses = async () => {
    return loader.getAllHarnesses(MatInputHarness);
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
      declarations: [ChangeHoursDialogComponent],
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

    fixture = TestBed.createComponent(ChangeHoursDialogComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('Disables action button when hours are not set', async () => {
    const button = actionButton();
    expect(button.disabled).toEqual(true);
  });
  it('Disables action button hours are the same', async () => {
    const [hoursFrom, hourTo] = await inputHarnesses();
    await hoursFrom.setValue(parkingLot.hourFrom);
    await hourTo.setValue(parkingLot.hourTo);
    fixture.detectChanges();
    const button = actionButton();

    expect(button.disabled).toEqual(true);
  });
  it('Sends falsy value on cancel', async () => {
    cancelButton().click();
    expect(dialogRefSpy.close.calls.mostRecent().args[0]).toBeFalsy();
  });
  it('Sends new hours on action button', async () => {
    parkingLot.hourFrom = '10:00';
    const [hoursFrom, hourTo] = await inputHarnesses();
    await hoursFrom.setValue('10:01');
    await hourTo.setValue(parkingLot.hourTo);

    actionButton().click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      hourFrom: '10:01',
      hourTo: parkingLot.hourTo,
    });
  });
});
