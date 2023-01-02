import { createSelector } from '@ngxs/store';
import { Id } from '../model/common.model';

export type Selectors = any[] | undefined;
export const loadingSelector = <T extends { loading: boolean }>(
  selectors: Selectors,
) => createSelector(selectors, ({ loading }: T): boolean => loading);

export const selectedEntity = <
  Entity,
  StateModel extends { selectedId: Id | null; entities: { [id: Id]: Entity } }
>(
  selectors: Selectors,
) =>
  createSelector(selectors, ({ selectedId, entities }: StateModel):
    | Entity
    | undefined => (selectedId ? entities[selectedId] : undefined));

export const allEntities = <
  Entity,
  StateModel extends { entities: { [id: Id]: Entity } }
>(
  selectors: Selectors,
) =>
  createSelector(selectors, ({ entities }: StateModel): Entity[] =>
    Object.values(entities),
  );
