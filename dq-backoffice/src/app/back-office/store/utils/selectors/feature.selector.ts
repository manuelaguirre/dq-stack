import { DqFeatureState, DqEntity, DqEntityMap } from '../../state';

export function dqFeatureAllEntitiesSelector<T>(
  state: DqFeatureState<T>,
): DqEntity<T[]> {
  return state.allEntities;
}

export function dqFeatureEntitiesSelector<T>(
  state: DqFeatureState<T>,
): DqEntityMap<T> {
  return state.entitiesMap;
}
