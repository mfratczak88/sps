import { Component, Input } from '@angular/core';

@Component({
  selector: 'sps-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @Input()
  size: Size = 'm';

  @Input()
  centered = false;

  cssClasses() {
    return [`size-${this.size}`, this.centered && 'centered'];
  }
}
export type Size = 'xs' | 's' | 'm' | 'l';
