import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormErrorKeys } from '../core/translation-keys';

export class LocalizedValidators {
  private static withErrorMessage(
    fn: ValidatorFn,
    localizedValidationError: LocalizedValidationError,
  ): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const validationError = fn(abstractControl);
      return (
        validationError && {
          ...validationError,
          ...localizedValidationError,
        }
      );
    };
  }

  static minLength(length: number) {
    return LocalizedValidators.withErrorMessage(
      Validators.minLength(length),
      LocalizedErrors.minLength(length),
    );
  }

  static maxLength(length: number) {
    return LocalizedValidators.withErrorMessage(
      Validators.maxLength(length),
      LocalizedErrors.maxLength(length),
    );
  }

  static get required() {
    return LocalizedValidators.withErrorMessage(
      Validators.required,
      LocalizedErrors.required(),
    );
  }

  static get email() {
    return LocalizedValidators.withErrorMessage(
      Validators.email,
      LocalizedErrors.email(),
    );
  }

  static min(value: number) {
    return LocalizedValidators.withErrorMessage(
      Validators.min(value),
      LocalizedErrors.min(value),
    );
  }

  static max(value: number) {
    return LocalizedValidators.withErrorMessage(
      Validators.max(value),
      LocalizedErrors.max(value),
    );
  }
}

export interface LocalizedValidationError extends ValidationErrors {
  errorMessage: string;
  props?: { [key: string]: string | number };
}

export const LocalizedErrors = {
  required: () => ({ errorMessage: FormErrorKeys.REQUIRED }),
  minLength: (length: number) => ({
    errorMessage: FormErrorKeys.MIN_LENGTH,
    props: { length },
  }),
  maxLength: (length: number) => ({
    errorMessage: FormErrorKeys.MAX_LENGTH,
    props: { length },
  }),
  email: () => ({
    errorMessage: FormErrorKeys.EMAIL,
  }),
  min: (value: number) => ({
    errorMessage: FormErrorKeys.MIN,
    props: { value },
  }),
  max: (value: number) => ({
    errorMessage: FormErrorKeys.MAX,
    props: { value },
  }),
  hourFromGreaterThanHourTo: () => ({
    errorMessage: FormErrorKeys.HOUR_FROM_GREATER_THAN_HOUR_TO,
  }),
  noCheckboxSelected: () => ({
    errorMessage: FormErrorKeys.NONE_CHECKBOX_SELECTED,
  }),
};
