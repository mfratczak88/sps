import { Component, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { OnChange, OnTouched } from 'src/app/core/model/forms.model';
import { Hours } from '../../../core/model/reservation.model';
import { AdminKeys } from '../../../core/translation-keys';
import {
  LocalizedErrors,
  LocalizedValidationError,
  LocalizedValidators,
} from '../../validator';

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
  @Input()
  set hourFrom(hour: number) {
    this._hourFrom = hour;
    this.reloadValidatorsOnControl();
  }

  @Input()
  set hourTo(hour: number) {
    this._hourTo = hour;
    this.reloadValidatorsOnControl();
  }

  hoursRange = [...Array(24).keys()];

  translations = { ...AdminKeys };

  private onTouched: () => void;

  private disabled = false;

  readonly form;

  private valueChangesSub$: Subscription;

  _hourFrom = 0;

  _hourTo = 23;

  constructor(private readonly formBuilder: FormBuilder) {
    this.form = this.formBuilder.nonNullable.group({
      hourFrom: new FormControl<number>(6, this.hourFromValidators()),
      hourTo: new FormControl(23, this.hourToValidators()),
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSub$ && this.valueChangesSub$.unsubscribe();
  }

  registerOnChange(fn: OnChange): void {
    this.valueChangesSub$ = this.form.valueChanges.subscribe(values => {
      fn(values);
      this.onTouched();
    });
  }

  registerOnTouched(fn: OnTouched): void {
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

  private hourToValidators() {
    return [
      LocalizedValidators.min(this._hourFrom + 1),
      LocalizedValidators.max(this._hourTo),
    ];
  }

  private hourFromValidators() {
    return [
      LocalizedValidators.min(this._hourFrom),
      LocalizedValidators.max(this._hourTo - 1),
    ];
  }

  private reloadValidatorsOnControl() {
    this.form.controls.hourFrom.setValidators(this.hourFromValidators());
    this.form.controls.hourTo.setValidators(this.hourToValidators());
    this.form.updateValueAndValidity();
  }
}
