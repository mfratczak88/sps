import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sps-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  @Input()
  topLevelPath: string;

  @Input()
  activePart: string;

  @Output()
  topLevelPathClicked = new EventEmitter<void>();
}
