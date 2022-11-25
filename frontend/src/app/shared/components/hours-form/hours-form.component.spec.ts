import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursFormComponent } from './hours-form.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { translateTestModule } from '../../../../test.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared.module';
import { MatSelectHarness } from '@angular/material/select/testing';
import { LocalizedErrors } from '../../validator';

describe('HoursFormComponent', () => {
  let component: HoursFormComponent;
  let fixture: ComponentFixture<HoursFormComponent>;
  let loader: HarnessLoader;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoursFormComponent],
      imports: [
        await translateTestModule(),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HoursFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
  const selectOptionNumber = async (select: MatSelectHarness, num: number) => {
    await select.open();
    return (await select.getOptions())[num]?.click();
  };
  const selectHarnesses = async () => loader.getAllHarnesses(MatSelectHarness);
  it('Is invalid when hours is invalid', async () => {
    component.writeValue({ hourFrom: -8, hourTo: 22 });
    expect(component.form.valid).toEqual(false);
    component.writeValue({ hourFrom: 5, hourTo: 28 });
    expect(component.form.valid).toEqual(false);
  });
  it('Is invalid when hour from > hour to', async () => {
    const [hourFrom, hourTo] = await loader.getAllHarnesses(MatSelectHarness);
    await selectOptionNumber(hourFrom, 8);
    await selectOptionNumber(hourTo, 2);

    expect(component.validate()).toEqual(
      LocalizedErrors.hourFromGreaterThanHourTo(),
    );
  });
  it('does not set value when form is disabled', async () => {
    const [hourFrom, hourTo] = await selectHarnesses();
    const hourFromPreviousValue = await hourFrom.getValueText();
    const hourToPreviousValue = await hourTo.getValueText();

    component.setDisabledState(true);

    await selectOptionNumber(hourFrom, 8);
    await selectOptionNumber(hourTo, 8);

    expect(await hourTo.getValueText()).toEqual(hourToPreviousValue);
    expect(await hourFrom.getValueText()).toEqual(hourFromPreviousValue);
  });
  it('shows same options on each of the dropdowns', async () => {
    const [hourFrom, hourTo] = await selectHarnesses();
    await hourFrom.open();
    await hourTo.open();
    const hourFromOptions = await Promise.all(
      (await hourFrom.getOptions()).map(x => x.getText()),
    );
    const hourToOptions = await Promise.all(
      (await hourTo.getOptions()).map(x => x.getText()),
    );

    expect(hourFromOptions).toEqual(hourToOptions);
  });
});
