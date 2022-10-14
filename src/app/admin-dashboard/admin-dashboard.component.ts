import { Component } from '@angular/core';
import { DrawerItem } from '../shared/components/drawer/drawer.component';

@Component({
  selector: 'sps-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  drawerItems: DrawerItem[] = [
    {
      name: 'Users',
      icon: 'person',
      onClick: () => {},
    },
    {
      name: 'Parking',
      icon: 'emoji_transportation',
      onClick: () => {},
    },
    {
      name: 'Reservations',
      icon: 'calendar_month',
      onClick: () => {},
    },
    {
      name: 'Dashboard',
      icon: 'dashboard',
      onClick: () => {},
    },
  ];
}
