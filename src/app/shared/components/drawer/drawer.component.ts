import { Component, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'sps-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  @Input()
  items: DrawerItem[] = [];

  @ViewChild(MatDrawer)
  drawer: MatDrawer;

  toggle() {
    this.drawer.toggle();
  }
}
export interface DrawerItem {
  icon: DrawerIcon;
  name: string;
  link: string;
}
export type DrawerIcon =
  | 'dashboard'
  | 'calendar_month'
  | 'person'
  | 'emoji_transportation';
