import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MiscKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit {
  readonly translations = MiscKeys;

  @Input()
  data: Observable<T[]>;

  @Input()
  loading$: Observable<boolean>;

  @Input()
  columns: Column[] = [];

  @Input()
  buttons: Button[] = [];

  @Input()
  withSearch = false;

  dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();

  ngOnInit(): void {
    this.data?.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  get columnNames() {
    const buttons = this.buttons ? [...this.buttons.map(b => b.name)] : [];
    const columns = this.columns ? [...this.columns.map(c => c.name)] : [];
    return [...columns, ...buttons];
  }
}

export type Column = {
  name: string;
  translation: string;
  sortable?: boolean;
};
export type Button = {
  icon: 'edit' | 'arrow_forward' | 'visibility' | 'delete';
  onClick: (row: unknown) => void;
} & Column;
