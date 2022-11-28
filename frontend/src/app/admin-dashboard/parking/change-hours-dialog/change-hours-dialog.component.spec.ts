import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeHoursDialogComponent } from './change-hours-dialog.component';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { mockParkingLots } from '../../../../../test/driver.utils';
import { ParkingLot } from '../../../core/model/parking-lot.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { translateTestModule } from '../../../../test.utils';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import SpyObj = jasmine.SpyObj;

describe('ChangeHoursDialogComponent', () => {
  let fixture: ComponentFixture<ChangeHoursDialogComponent>;
  let loader: HarnessLoader;
  let parkingLot: ParkingLot;
  let dialogRefSpy: SpyObj<MatDialogRef<ChangeHoursDialogComponent>>;

  const selectHarnesses = async () => {
    return loader.getAllHarnesses(MatSelectHarness);
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
    const [hoursFrom, hourTo] = await selectHarnesses();
    await hoursFrom.open();
    await hourTo.open();
    fixture.detectChanges();
    const button = actionButton();

    expect(button.disabled).toEqual(true);
  });
  it('Sends falsy value on cancel', async () => {
    cancelButton().click();
    expect(dialogRefSpy.close.calls.mostRecent().args[0]).toBeFalsy();
  });
  it('Sends new hours on action button', async () => {
    const [hoursFrom, hourTo] = await selectHarnesses();
    await Promise.all([hoursFrom.open(), hourTo.open()]);
    await (await hoursFrom.getOptions())[11].click();
    await (await hourTo.getOptions())[13].click();

    actionButton().click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      hourFrom: 11,
      hourTo: 13,
    });
  });
});
