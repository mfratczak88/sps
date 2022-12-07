import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TableComponent } from '../table/table.component';
import { Observable, of } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'sps-async-table',
  templateUrl: '../table/table.component.html',
  styleUrls: ['../table/table.component.scss'],
})
export class AsyncTableComponent extends TableComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatTable) table: MatTable<any>;

  @Input()
  page$: Observable<number> = of(1);

  @Output()
  pageChanged = new EventEmitter<number>();

  onPageChange({ pageIndex }: PageEvent) {
    this.pageChanged.emit(pageIndex + 1);
  }

  get pageIndex$() {
    return this.page$.pipe(map(page => page - 1));
  }
}
export interface Sort {
  by: string;
  order: string;
}
