import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { AdminKeys } from '../../../core/translation-keys';
import {
  LocalizedErrors,
  LocalizedValidationError,
  LocalizedValidators,
} from '../../validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sps-hours-form',
  templateUrl: './hours-form.component.html',
  styleUrls: ['./hours-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: HoursFormComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: HoursFormComponent,
    },
  ],
})
export class HoursFormComponent
  implements ControlValueAccessor, Validator, OnDestroy {
  translations = { ...AdminKeys };

  hours = [...Array(24).keys()];

  onTouched: () => void;

  touched = false;

  disabled = false;

  form: FormGroup;

  valueChangesSub$: Subscription;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      hourFrom: [6, [LocalizedValidators.min(0), LocalizedValidators.max(23)]],
      hourTo: [23, [LocalizedValidators.min(1), LocalizedValidators.max(24)]],
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSub$.unsubscribe();
  }

  registerOnChange(fn: any): void {
    this.valueChangesSub$ = this.form.valueChanges.subscribe(values => {
      fn(values);
      this.onTouched();
    });
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.disabled ? this.form.disable() : this.form.enable();
  }

  writeValue(hours: Hours): void {
    if (!this.disabled) {
      this.form.setValue(hours);
    }
  }

  validate(): LocalizedValidationError | null {
    if (this.form.errors) {
      return this.form.errors as LocalizedValidationError;
    }
    const { hourFrom, hourTo } = this.form.value;
    if (Number(hourFrom) > Number(hourTo)) {
      return LocalizedErrors.hourFromGreaterThanHourTo();
    }
    return null;
  }
}

export interface Hours {
  hourFrom: number;
  hourTo: number;
}
