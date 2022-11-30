import { Component } from '@angular/core';
import { DrawerItem } from '../shared/components/drawer/drawer.component';
import { DrawerKeys } from '../core/translation-keys';
import { DriverPaths } from '../routes';

@Component({
  selector: 'sps-driver-dashboard',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class DashboardComponent {
  drawerItems: DrawerItem[] = [
    {
      name: DrawerKeys.RESERVATIONS,
      icon: 'calendar_month',
      link: DriverPaths.RESERVATIONS,
    },
    {
      name: DrawerKeys.PARKING,
      icon: 'emoji_transportation',
      link: DriverPaths.PARKING_LOTS,
    },
    {
      name: DrawerKeys.VEHICLES,
      icon: 'directions_car',
      link: DriverPaths.VEHICLES,
    },
  ];
}
