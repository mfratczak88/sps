import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  DialogData,
  EditTimeDialogComponent,
} from './edit-time-dialog.component';
import {
  hoursFromReservations,
  mockReservations,
} from '../../../../../test/reservation.util';
import { translateTestModule } from '../../../../test.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { HoursFormComponent } from '../../../shared/components/hours-form/hours-form.component';
import { DateTime } from 'luxon';
import SpyObj = jasmine.SpyObj;

describe('EditTimeDialogComponent', () => {
  let fixture: ComponentFixture<EditTimeDialogComponent>;
  const [reservation] = mockReservations;
  const dateValidatorSpy = () => true;
  let dialogRefSpy: SpyObj<MatDialogRef<EditTimeDialogComponent>>;
  let dialogData: DialogData;

  const hoursForm = () =>
    fixture.debugElement.query(By.css('sps-hours-form'))
      .componentInstance as HoursFormComponent;

  const assignButton = () =>
    fixture.debugElement.query(By.css('.edit-button'))
      .nativeElement as HTMLButtonElement;

  const closeButton = () =>
    fixture.debugElement.query(By.css('.close-button'))
      .nativeElement as HTMLButtonElement;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DialogRefSpy', ['close']);
    dialogData = {
      hours: hoursFromReservations(reservation),
      date: reservation.date,
      dateValidator: dateValidatorSpy,
    };
    await TestBed.configureTestingModule({
      imports: [
        await translateTestModule(),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [EditTimeDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTimeDialogComponent);
    fixture.detectChanges();
  });

  it('Disables submit button when form is untouched', async () => {
    const btnAssign = assignButton();
    expect(btnAssign.disabled).toEqual(true);
  });
  it('Disables submit button when form is invalid', () => {
    const hours = hoursForm();
    hours.writeValue({
      hourFrom: 9,
      hourTo: 1,
    });
    fixture.detectChanges();

    expect(assignButton().disabled).toEqual(true);
  });
  it('Disables submit button when hours has not changed', () => {
    const { hourFrom, hourTo } = hoursFromReservations(reservation);
    const formHours = hoursForm();

    formHours.writeValue({
      hourFrom,
      hourTo,
    });
    fixture.detectChanges();

    expect(assignButton().disabled).toEqual(true);
  });
  it('On submit emits hours and date', () => {
    const { hourFrom, hourTo } = hoursFromReservations(reservation);
    const hours = {
      hourFrom: hourFrom + 1,
      hourTo,
    };
    const formHours = hoursForm();
    formHours.writeValue(hours);
    fixture.detectChanges();

    assignButton().click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      date: DateTime.fromISO(reservation.date).toJSDate(),
      hours,
    });
  });
  it('On close emits empty value', () => {
    const btnClose = closeButton();

    btnClose.click();

    expect(dialogRefSpy.close.calls.mostRecent().args).toEqual([]);
  });
});
