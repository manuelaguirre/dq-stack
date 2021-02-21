import { Action } from '@ngrx/store';
import {
  DqEntity,
  DqEntityMap,
} from '../../state';
import { DqActions } from '../actions';

export const initialEntityState: DqEntityMap<any> = { entities: {} };

export function dqEntitiesReducer<T>(
  type: string,
  reducer?: (state: DqEntity<T>, action: Action) => DqEntity<T>,
): (state: DqEntityMap<T>, action: DqActions.DqLoadOneLoadAction) => DqEntityMap<T> {
  return (
    state: DqEntityMap<T> = initialEntityState,
    action: DqActions.DqLoadOneLoadAction,
  ): DqEntityMap<T> => {
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
