import { Action } from '@ngrx/store';
import {
  DqEntity,
  DqEntityState,
} from '../state';
import {
  DqLoadOneLoadAction,
} from './loader.actions';

export const initialEntityState: DqEntityState<any> = { entities: {} };

export function entitiesReducer<T>(
  type: string,
  reducer?: (state: DqEntity<T>, action: Action) => DqEntity<T>,
): (state: DqEntityState<T>, action: DqLoadOneLoadAction) => DqEntityState<T> {
  return (
    state: DqEntityState<T> = initialEntityState,
    action: DqLoadOneLoadAction,
  ): DqEntityState<T> => {
    if (
      action.meta
      && action.feature === type
    ) {
      return {
        entities: {
          ...state.entities,
          [action.id]: reducer
            ? reducer(state.entities[action.id], action)
            : state[action.id],
        },
      };
    }
    return state;
  };
}
