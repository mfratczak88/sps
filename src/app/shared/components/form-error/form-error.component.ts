import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocalizedValidationError } from '../../validator';

@Component({
  selector: 'sps-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent {
  constructor(private readonly translateService: TranslateService) {}

  @Input()
  control: AbstractControl | FormControl;

  extractErrorMessage() {
    const error = this.control.errors as LocalizedValidationError | null;
    if (!error) return '';
    const { errorMessage, props } = error;
    return this.translateService.instant(errorMessage, props);
  }
}
