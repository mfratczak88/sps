import { createSelector } from '@ngxs/store';
import { UiState, UiStateModel } from './ui.state';

export const lang = createSelector(
  [UiState],
  ({ language }: UiStateModel) => language,
);
export const availableLanguages = createSelector(
  [UiState],
  ({ languages }: UiStateModel) => Object.values(languages),
);
