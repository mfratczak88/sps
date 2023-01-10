import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'sps-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input()
  paging$: Observable<Paging> = of({ page: 0, pageSize: 5 });

  @Input()
  count$: Observable<number> = of(0);

  @Input()
  pageSize: number[];

  @Output()
  pagingChanged = new EventEmitter<Paging>();
}

export interface Paging {
  page: number;
  pageSize: number;
}
