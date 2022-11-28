import { Component } from '@angular/core';
import { ErrorKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
})
export class UnauthorizedComponent {
  translations = { ...ErrorKeys };
}
