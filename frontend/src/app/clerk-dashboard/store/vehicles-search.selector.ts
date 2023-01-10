import { createSelector } from '@ngxs/store';
import {
  VehicleSearchState,
  VehiclesSearchStateModel,
} from './vehicles-search.state';
import { loadingSelector } from '../../core/store/selectors';

export const licensePlateFound = createSelector(
  [VehicleSearchState],
  ({ searchResults }: VehiclesSearchStateModel) => searchResults,
);
export const loading = loadingSelector([VehicleSearchState]);
