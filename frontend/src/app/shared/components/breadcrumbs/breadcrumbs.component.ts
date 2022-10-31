import { Component } from '@angular/core';
import { RouterQuery } from '../../../core/state/router/router.query';

@Component({
  selector: 'sps-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  breadCrumbs: BreadCrumb[] = [];

  constructor(readonly routerQuery: RouterQuery) {
    this.routerQuery.breadCrumbs$().subscribe(breadCrumb => {
      this.breadCrumbs = [];
      let next = breadCrumb;
      while (next) {
        const { label, parent } = next;
        let { path } = next;
        if (path.includes(':')) {
          const queryParam = this.routerQuery.getParam(path.split(':')[1]);
          path = queryParam
            ? parent?.data?.['breadcrumbs'].path + '/' + queryParam
            : path;
        }
        this.breadCrumbs.push({
          label,
          path,
        });
        next = parent?.data?.['breadcrumbs'] as BreadCrumb;
      }
      this.breadCrumbs = this.breadCrumbs.reverse();
      console.log(this.breadCrumbs);
    });
  }
}

interface BreadCrumb {
  label: string;
  path: string;
}
