import { BreadCrumbs } from '../../model/router.model';
import { Params } from '@angular/router';

export interface RouterStateParams {
  url: string;
  params: Params;
  queryParams: Params;
  breadcrumbs?: BreadCrumbs;
  fragment?: string | null;
}
