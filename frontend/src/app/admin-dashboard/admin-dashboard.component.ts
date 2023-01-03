import { Component } from '@angular/core';
import { DrawerItem } from '../shared/components/drawer/drawer.component';
import { DrawerKeys } from '../core/translation-keys';
import { AdminPaths } from '../routes';
import { Store } from '@ngxs/store';
import { AdminActions } from '../core/store/actions/admin.actions';

// todo: put those dashboards components into single one
@Component({
  selector: 'sps-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  drawerItems: DrawerItem[] = [
    {
      name: DrawerKeys.DASHBOARD,
      icon: 'dashboard',
      link: AdminPaths.DASHBOARD,
    },
    {
      name: DrawerKeys.PARKING,
      icon: 'emoji_transportation',
      link: AdminPaths.PARKING,
    },
    {
      name: DrawerKeys.RESERVATIONS,
      icon: 'calendar_month',
      link: AdminPaths.RESERVATIONS,
    },
    {
      name: DrawerKeys.DRIVERS,
      icon: 'camera_front',
      link: AdminPaths.DRIVERS,
    },
    {
      name: DrawerKeys.USERS,
      icon: 'person',
      link: AdminPaths.USERS,
    },
  ];

  constructor(private readonly store: Store) {
    this.store.dispatch(new AdminActions.GetAllParkingLots());
  }
}
