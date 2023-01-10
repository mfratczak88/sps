import { Navigate } from '@ngxs/router-plugin';

export namespace RoutingActions {
  export class QueryParamsChange extends Navigate {
    constructor(
      page?: number,
      pageSize?: number,
      sortBy?: string,
      sortOrder?: string,
    ) {
      super(
        [],
        { sortBy, sortOrder, page, pageSize },
        {
          queryParamsHandling: 'merge',
        },
      );
    }
  }
}
