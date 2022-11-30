import { AdminPaths } from '../../routes';

import { DrawerKeys } from '../../core/translation-keys';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsersListComponent } from './list/list.component';
import { DASHBOARD_ROUTE } from '../routing';

export const USER_LIST_ROUTE = {
  path: '',
  component: UsersListComponent,
  data: {
    breadcrumbs: {
      label: DrawerKeys.USERS,
      path: AdminPaths.USERS,
      parent: DASHBOARD_ROUTE,
    },
  },
};
@NgModule({
  imports: [RouterModule.forChild([USER_LIST_ROUTE])],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
