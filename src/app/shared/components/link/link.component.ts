import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sps-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
  @Output()
  click = new EventEmitter<void>();
}
