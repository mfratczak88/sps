import { Component, Input } from '@angular/core';

@Component({
  selector: 'sps-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  panelOpenState = true;

  @Input()
  title: string;

  @Input()
  description: string;
}
