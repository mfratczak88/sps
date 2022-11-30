import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

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

  @Input()
  loading$: Observable<boolean>;

  @Output()
  clicked = new EventEmitter<void>();
}
