import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sps-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input()
  title: string;

  @Input()
  subTitle: string;

  @Input()
  clickable = false;

  @Output()
  clicked = new EventEmitter<void>();
}
