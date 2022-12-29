import { Store } from '@ngxs/store';

export const setRouterParams = (store: Store, params: any) =>
  store.reset({
    ...store.snapshot(),
    router: {
      state: {
        ...params,
      },
    },
  });

export const setRouterQueryParams = (store: Store, queryParams: any) =>
  store.reset({
    ...store.snapshot(),
    router: {
      state: {
        queryParams: {
          ...queryParams,
        },
      },
    },
  });

export const setFragment = (store: Store, fragment: string) =>
  store.reset({
    ...store.snapshot(),
    router: {
      state: {
        fragment,
      },
    },
  });
