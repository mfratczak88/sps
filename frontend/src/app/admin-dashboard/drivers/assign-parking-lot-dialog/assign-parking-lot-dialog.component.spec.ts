import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignParkingLotDialogComponent } from './assign-parking-lot-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { AddressPipe } from '../../../shared/pipe/address.pipe';
import { translateTestModule } from '../../../../test.utils';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { mockParkingLots } from '../../../../../test/driver.utils';
import SpyObj = jasmine.SpyObj;

describe('AssignParkingLotDialogComponent', () => {
  let fixture: ComponentFixture<AssignParkingLotDialogComponent>;
  let dialogRefSpy: SpyObj<MatDialogRef<AssignParkingLotDialogComponent>>;
  let loader: HarnessLoader;
  const addressPipe: AddressPipe = new AddressPipe();
  const parkingLots = mockParkingLots;
  const selectHarness = () => loader.getHarness(MatSelectHarness);
  const closeButton = () =>
    fixture.debugElement.query(By.css('.close-button'))
      .nativeElement as HTMLButtonElement;
  const assignButton = () =>
    fixture.debugElement.query(By.css('.assign-button'))
      .componentInstance as MatButton;
  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      declarations: [AssignParkingLotDialogComponent],
      imports: [
        SharedModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        await translateTestModule(),
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: of(parkingLots),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignParkingLotDialogComponent);

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('Shows list of parking lots', async () => {
    const select = await selectHarness();
    await select.open();
    const [firstLotAddress, secondLotAddress] = await select.getOptions();
    expect(await firstLotAddress.getText()).toEqual(
      addressPipe.transform(parkingLots[0]),
    );
    expect(await secondLotAddress.getText()).toEqual(
      addressPipe.transform(parkingLots[1]),
    );
  });
  it('Disables assign button when no address selected', async () => {
    const select = await selectHarness();
    const button = assignButton();
    expect(await select.isValid()).toEqual(false);
    expect(button.disabled).toEqual(true);
  });

  it('Enables assign button when lot is selected', async () => {
    const select = await selectHarness();
    const button = assignButton();
    await select.open();
    await (await select.getOptions())[0].click();
    expect(await select.isValid()).toEqual(true);
    expect(button.disabled).toEqual(false);
  });
  it('On assign button click it passes lot id', async () => {
    const select = await selectHarness();
    const button = assignButton();
    await select.open();
    await (await select.getOptions())[1].click();
    (button._elementRef.nativeElement as HTMLButtonElement).click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(parkingLots[1].id);
  });
  it('On cancel closes dialog with lot id falsy', async () => {
    const button = closeButton();
    button.click();
    expect(dialogRefSpy.close).toHaveBeenCalled();
    expect(dialogRefSpy.close.calls.mostRecent().args).toEqual([]);
  });
});
