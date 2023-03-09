import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  breadCrumbs as routerBreadcrumbs,
  paramByName,
} from '../../../core/store/routing/routing.selector';

@Component({
  selector: 'sps-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  breadCrumbs: BreadCrumb[] = [];

  constructor(readonly store: Store) {
    this.store.select(routerBreadcrumbs).subscribe((breadCrumb) => {
      this.breadCrumbs = [];
      let next = breadCrumb;
      while (next) {
        const { label, parent } = next;
        let { path } = next;
        if (path.includes(':')) {
          const param = this.store.selectSnapshot(
            paramByName(path.split(':')[1]),
          );
          path = param
            ? parent?.data?.['breadcrumbs'].path + '/' + param
            : path;
        }
        this.breadCrumbs.push({
          label,
          path,
        });
        next = parent?.data?.['breadcrumbs'] as BreadCrumb;
      }
      this.breadCrumbs = this.breadCrumbs.reverse();
    });
  }
}

interface BreadCrumb {
  label: string;
  path: string;
}
