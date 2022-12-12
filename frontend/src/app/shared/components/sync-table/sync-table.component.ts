import { Component, ElementRef, ViewChild } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'sps-sync-table',
  templateUrl: './../table/table.component.html',
  styleUrls: ['./../table/table.component.scss'],
})
export class SyncTableComponent extends TableComponent {
  private paginator: MatPaginator;

  private sort: MatSort;

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

  private setDataSourceAttributes(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
