import { getActionTypeFromInstance, NgxsNextPluginFn } from '@ngxs/store';
import { AuthActions } from './actions/auth.actions';
import { defaultState, StateModel } from './state.model';

export const logoutPlugin = (
  state: StateModel,
  action: any,
  next: NgxsNextPluginFn,
) => {
  if (getActionTypeFromInstance(action) === AuthActions.LogoutFinished.type) {
    state = {
      ...state,
      ...defaultState,
    };
  }
  return next(state, action);
};
