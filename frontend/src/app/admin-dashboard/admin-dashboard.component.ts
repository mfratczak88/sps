import { Component } from '@angular/core';
import { DrawerItem } from '../shared/components/drawer/drawer.component';
import { AdminDrawerKeys } from '../core/translation-keys';
import { AdminPaths } from '../routes';

@Component({
  selector: 'sps-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  drawerItems: DrawerItem[] = [
    {
      name: AdminDrawerKeys.DASHBOARD,
      icon: 'dashboard',
      link: AdminPaths.DASHBOARD,
    },
    {
      name: AdminDrawerKeys.PARKING,
      icon: 'emoji_transportation',
      link: AdminPaths.PARKING,
    },
    {
      name: AdminDrawerKeys.RESERVATIONS,
      icon: 'calendar_month',
      link: AdminPaths.RESERVATIONS,
    },
    {
      name: AdminDrawerKeys.DRIVERS,
      icon: 'camera_front',
      link: AdminPaths.DRIVERS,
    },
    {
      name: AdminDrawerKeys.USERS,
      icon: 'person',
      link: AdminPaths.USERS,
    },
  ];
}
