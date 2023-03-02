import { Component, OnDestroy } from '@angular/core';
import { WeekDays } from '../../../core/translation-keys';

import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DayToTranslation } from '../../../core/model/common.model';
import { LocalizedErrors, LocalizedValidationError } from '../../validator';

@Component({
  selector: 'sps-weekdays-form',
  templateUrl: './weekdays-form.component.html',
  styleUrls: ['./weekdays-form.component.scss'],
  providers: [
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: WeekdaysFormComponent,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: WeekdaysFormComponent,
    },
  ],
})
export class WeekdaysFormComponent
  implements Validator, ControlValueAccessor, OnDestroy {
  translations = { ...WeekDays };

  disabled = false;

  onTouch: () => void;

  valueChanges$: Subscription;

  days = Object.entries(DayToTranslation).map(([key, value]) => ({
    number: key,
    translationKey: value,
  }));

  form: FormGroup<WeekdaysForm>;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group<WeekdaysForm>({
      weekdays: formBuilder.array(
        this.days.map(() => new FormControl<boolean>(false)),
      ),
    });
  }

  ngOnDestroy(): void {
    this.valueChanges$.unsubscribe();
  }

  registerOnChange(fn: (weekdays: number[]) => void): void {
    this.valueChanges$ = this.form.valueChanges.subscribe(values => {
      const weekdays: number[] = [];
      values.weekdays?.forEach((selected, i) => {
        if (selected) weekdays.push(i);
      });
      fn(weekdays);
      this.onTouch();
    });
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
    this.disabled = isDisabled;
  }

  validate(): LocalizedValidationError | null {
    const allUnchecked = this.weekDaysControls.every(c => !c.value);
    return allUnchecked ? LocalizedErrors.noCheckboxSelected() : null;
  }

  writeValue(weekdays: number[]): void {
    if (!this.disabled) {
      weekdays &&
        weekdays.forEach(day => {
          day < 7 && this.weekDaysControls[day].setValue(true);
        });
    }
  }

  get weekDaysControls() {
    return this.form.controls.weekdays.controls;
  }
}

interface WeekdaysForm {
  weekdays: FormArray<FormControl<boolean | null>>;
}
