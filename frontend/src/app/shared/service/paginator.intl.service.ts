import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PaginationKeys } from '../../core/translation-keys';
import { Injectable } from '@angular/core';

@Injectable()
export class PaginatorIntlService implements MatPaginatorIntl {
  readonly changes: Subject<void> = new Subject<void>();

  firstPageLabel: string = this.translateService.instant(
    PaginationKeys.FIRST_PAGE_LABEL,
  );

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const props =
      length === 0
        ? { page: 1, of: 1 }
        : { page: page + 1, of: Math.ceil(length / pageSize) };
    return this.translateService.instant(PaginationKeys.RANGE_LABEL, props);
  }

  itemsPerPageLabel: string = this.translateService.instant(
    PaginationKeys.ITEMS_PER_PAGE_LABEL,
  );

  lastPageLabel: string = this.translateService.instant(
    PaginationKeys.LAST_PAGE_LABEL,
  );

  nextPageLabel: string = this.translateService.instant(
    PaginationKeys.NEXT_PAGE_LABEL,
  );

  previousPageLabel: string = this.translateService.instant(
    PaginationKeys.PREVIOUS_PAGE_LABEL,
  );

  constructor(private readonly translateService: TranslateService) {}
}
