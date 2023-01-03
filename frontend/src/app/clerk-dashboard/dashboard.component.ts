import { Component } from '@angular/core';
import { DrawerItem } from '../shared/components/drawer/drawer.component';
import { DrawerKeys } from '../core/translation-keys';
import { ClerkPaths } from '../routes';
import { Store } from '@ngxs/store';
import { ClerkActions } from '../core/store/actions/clerk.actions';

@Component({
  selector: 'sps-clerk-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  readonly drawerItems: DrawerItem[] = [
    {
      name: DrawerKeys.OPERATIONS,
      icon: 'swap_horizontal_circle',
      link: ClerkPaths.OPERATIONS,
    },
  ];

  constructor(private readonly store: Store) {
    this.store.dispatch(new ClerkActions.LoadLicensePlates());
  }
}
