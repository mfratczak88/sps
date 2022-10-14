import { Component } from '@angular/core';
import { DrawerItem } from '../shared/components/drawer/drawer.component';
import { AdminPaths } from '../app-routing.module';
import { AdminDrawerKeys } from '../core/translation-keys';

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
      name: AdminDrawerKeys.USERS,
      icon: 'person',
      link: AdminPaths.USERS,
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
  ];
}
