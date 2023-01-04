import { SortBy, SortOrder } from '../../model/reservation.model';
import { Id } from '../../model/common.model';

export class PageChange {
  constructor(readonly page: number, readonly pageSize?: number) {}
}
export class SortChange {
  constructor(readonly sortBy?: SortBy, readonly sortOrder?: SortOrder) {}
}
export class GetById {
  constructor(readonly id: Id) {}
}
export class MutationById {
  constructor(readonly id: Id) {}
}
