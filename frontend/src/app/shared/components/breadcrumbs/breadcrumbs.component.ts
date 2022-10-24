import { Component } from '@angular/core';
import { RouterQuery } from '../../../core/state/router/router.query';

@Component({
  selector: 'sps-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  constructor(readonly routerQuery: RouterQuery) {}
}
