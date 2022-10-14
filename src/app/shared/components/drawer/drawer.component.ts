import { Component, Input } from '@angular/core';

@Component({
  selector: 'sps-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  @Input()
  items: DrawerItem[] = [];
}
export interface DrawerItem {
  icon: DrawerIcon;
  name: string;
  onClick: () => void;
}
export type DrawerIcon =
  | 'dashboard'
  | 'calendar_month'
  | 'person'
  | 'emoji_transportation';
