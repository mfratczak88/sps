import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { map } from 'rxjs';

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

  readonly drawerOpenedFirst$;

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.drawerOpenedFirst$ = this.breakpointObserver
      .observe(['(min-width:500px)'])
      .pipe(map((x) => x.matches));
  }

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
  | 'emoji_transportation'
  | 'camera_front'
  | 'directions_car'
  | 'swap_horizontal_circle';
