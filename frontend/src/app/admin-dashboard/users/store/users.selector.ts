import { createSelector } from '@ngxs/store';
import { UsersState, UsersStateModel } from './users.state';

export const roles = createSelector(
  [UsersState],
  ({ roles }: UsersStateModel) => roles,
);
export const users = createSelector(
  [UsersState],
  ({ entities }: UsersStateModel) => Object.values(entities),
);
export const loading = createSelector(
  [UsersState],
  ({ loading }: UsersStateModel) => loading,
);
