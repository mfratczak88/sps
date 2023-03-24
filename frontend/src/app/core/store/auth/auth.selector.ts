import { createSelector } from '@ngxs/store';
import { AuthState, defaults } from './auth.state';
import equal from 'fast-deep-equal';
import { Role } from '../../model/auth.model';
import { loadingSelector } from '../selectors';

export const userRole = createSelector([AuthState], ({ role }) => role as Role);
export const userId = createSelector([AuthState], ({ id }) => id);
export const isLoggedIn = createSelector(
  [AuthState],
  (state) => !!state && !equal(state, defaults),
);
export const user = createSelector([AuthState], (user) => user);
export const loading = loadingSelector([AuthState]);
