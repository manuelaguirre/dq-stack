import { Action } from '@ngrx/store';
import {
  DqEntityState,
  initializeState,
} from '../state';
import {
  DqLoadOneLoadAction,
  DqLoadOneFailAction,
  DqLoadOneSuccessAction,
  DQ_ENTITY_LOAD_ACTION,
  DQ_ENTITY_FAIL_ACTION,
  DQ_ENTITY_SUCCESS_ACTION,
} from './loader.actions';

export function loaderEntitiesReducer<T>(
  type: string,
  reducer?: (state: T, action: Action) => T,
): (state: DqEntityState<T>, action: DqLoadOneLoadAction) => DqEntityState<T> {
  return (
    state: DqEntityState<T> = (initializeState()[type] as DqEntityState<T>),
    action: DqLoadOneLoadAction,
  ): DqEntityState<T> => {
    if (
      action.meta
      && action.type === type
    ) {
      const metatype = action.meta;

      if (metatype === DQ_ENTITY_LOAD_ACTION) {
        return {
          ...state,
          [action.id]: {
            ...state[action.id],
            loading: true,
            value: null,
          },
        };
      } if (metatype === DQ_ENTITY_FAIL_ACTION) {
        return {
          ...state,
          [action.id]: {
            ...state[action.id],
            loading: false,
            error: (action as DqLoadOneFailAction).error,
            value: null,
            success: false,
          },
        };
      } if (metatype === DQ_ENTITY_SUCCESS_ACTION) {
        return {
          ...state,
          [action.id]: {
            ...state[action.id],
            loading: false,
            error: null,
            value: reducer ? reducer(state[action.id].value, action) : (action as DqLoadOneSuccessAction<T>).payload,
            success: true,
          },
        };
      }
      // reset state action
      return {
        ...initializeState()[type],
        value: reducer
          ? reducer(initializeState()[type], action)
          : initializeState()[type].value,
      };
    }
    return state;
  };
}
