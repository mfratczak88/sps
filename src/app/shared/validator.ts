import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

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
      LocalizedErrors['required'](),
    );
  }

  static get email() {
    return LocalizedValidators.withErrorMessage(
      Validators.email,
      LocalizedErrors.email(),
    );
  }
}

export interface LocalizedValidationError extends ValidationErrors {
  errorMessage: string;
  props?: { [key: string]: string | number };
}

export const LocalizedErrors = {
  required: () => ({ errorMessage: 'FORM_ERROR.REQUIRED' }),
  minLength: (length: number) => ({
    errorMessage: 'FORM_ERROR.MIN_LENGTH',
    props: { length },
  }),
  maxLength: (length: number) => ({
    errorMessage: 'FORM_ERROR.MIN_LENGTH',
    props: { length },
  }),
  email: () => ({
    errorMessage: 'FORM_ERROR.EMAIL',
  }),
};
