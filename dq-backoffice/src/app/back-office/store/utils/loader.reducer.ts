import { Action } from '@ngrx/store';
import { DqEntitiesState, initializeState } from '../state';
import { DqLoaderAction } from './loader.actions';

export function loaderReducer<T>(
  entityType: string,
  reducer?: (state: T, action: Action) => T,
): (state: DqEntitiesState<T>, action: DqLoaderAction) => DqEntitiesState<T> {
  return (
    state: DqEntitiesState<T> = initializeState()[entityType],
    action: DqLoaderAction,
  ): DqEntitiesState<T> => {
    if (
      action.meta
      && action.meta.loader
      && action.meta.entityType === entityType
    ) {
      const entity = action.meta.loader;

      if (entity.load) {
        return {
          ...state,
          loading: true,
          value: reducer ? reducer(state.value, action) : state.value,
        };
      } if (entity.error) {
        return {
          ...state,
          loading: false,
          error: true,
          success: false,
          value: reducer ? reducer(state.value, action) : undefined,
        };
      } if (entity.success) {
        return {
          ...state,
          value: reducer ? reducer(state.value, action) : action.payload,
          loading: false,
          error: false,
          success: true,
        };
      }
      // reset state action
      return {
        ...initialLoaderState,
        value: reducer
          ? reducer(initialLoaderState.value, action)
          : initialLoaderState.value,
      };
    }

    if (reducer) {
      const newValue = reducer(state.allEntities, action);
      if (newValue !== state.value) {
        return { ...state, value: newValue };
      }
    }
    return state;
  };
}
