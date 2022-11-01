import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MiscKeys } from '../../../core/translation-keys';

@Component({
  selector: 'sps-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  readonly translations = MiscKeys;

  @Input()
  data: Observable<any>;

  @Input()
  loading$: Observable<boolean>;

  @Input()
  columns: Column[] = [];

  @Input()
  buttons: Button[] = [];

  @Input()
  withSearch = false;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  filter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.data.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
};
export type Button = {
  icon: 'edit' | 'arrow_forward' | 'visibility';
  onClick: (row: any) => void;
} & Column;
