import { Component, Input } from '@angular/core';

@Component({
  selector: 'sps-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss'],
})
export class HeadingComponent {
  @Input()
  size: Size = 'm';

  @Input()
  centered = false;

  cssClasses() {
    return [`heading-${this.size}`, this.centered && `align-center`];
  }
}
export type Size = 's' | 'm' | 'l' | 'xl';
