export namespace UiActions {
  export class ShowToast {
    static readonly type = '[Toast] Show';

    constructor(readonly textKey: string) {}
  }
  export class ReservationTableSortChange {
    static readonly type = '[Reservations Table] Sort Change';

    constructor(readonly sortBy: string, readonly sortOrder: 'asc' | 'desc') {}
  }
  export class ReservationTablePagingChange {
    static readonly type = '[Reservations Table] Paging Change';

    constructor(readonly page: number, readonly pageSize: number) {}
  }
}
