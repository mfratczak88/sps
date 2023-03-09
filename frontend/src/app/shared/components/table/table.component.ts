import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MiscKeys } from 'src/app/core/translation-keys';

@Component({
  selector: 'sps-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  readonly translations = MiscKeys;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.setDataSourceAttributes();
  }

  @ViewChild('searchField')
  set inputSearchField(elementElementRef: ElementRef<HTMLInputElement>) {
    const searchField = elementElementRef?.nativeElement;
    searchField?.addEventListener('keyup', () => {
      this.dataSource.filter = searchField.value.trim().toLowerCase();
    });
  }

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

  private paginator: MatPaginator;

  private sort: MatSort;

  ngOnInit(): void {
    this.data?.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  get columnNames() {
    const columns = this.columns ? [...this.columns.map(c => c.name)] : [];
    return [...columns, 'buttons'];
  }

  private setDataSourceAttributes(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}

export type Column = {
  name: string;
  translation: string;
  sortable?: boolean;
};
export type OnButtonClick = (data: any) => void;
export type Button = {
  icon: 'edit' | 'arrow_forward' | 'visibility' | 'delete';
  onClick: OnButtonClick;
} & Column;
