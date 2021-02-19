import { Action } from '@ngrx/store';
import {
  DqEntity,
  initializeState,
} from '../state';
import {
  DqLoadAllLoadAction,
  DqLoadAllFailAction,
  DqLoadAllSuccessAction,
  DQ_ALL_LOAD_ACTION,
  DQ_ALL_FAIL_ACTION,
  DQ_ALL_SUCCESS_ACTION,
  DQ_ENTITY_LOAD_ACTION,
  DQ_ENTITY_FAIL_ACTION,
  DQ_ENTITY_SUCCESS_ACTION,
  DqLoaderAction,
} from './loader.actions';

const initialLoaderState = (): DqEntity<any> => ({
  loading: false,
  error: null,
  success: false,
  value: null,
});

export function loaderReducer<T>(
  type: string,
  reducer?: (state: T, action: Action) => T,
): (state: DqEntity<T>, action: DqLoaderAction) => DqEntity<T> {
  return (
    state: DqEntity<T> = initialLoaderState(),
    action: DqLoaderAction,
  ): DqEntity<T> => {
    if (
      action.meta
      && action.feature === type
    ) {
      const metatype = action.meta;

      if (metatype === DQ_ALL_LOAD_ACTION
        || metatype === DQ_ENTITY_LOAD_ACTION) {
        return {
          ...state,
          loading: true,
          value: reducer ? reducer(state.value, action) : state.value,
        };
      } if (metatype === DQ_ALL_FAIL_ACTION
        || metatype === DQ_ENTITY_FAIL_ACTION) {
        return {
          ...state,
          loading: false,
          error: (action as DqLoadAllFailAction).payload,
          success: false,
          value: reducer ? reducer(state.value, action) : undefined,
        };
      } if (metatype === DQ_ALL_SUCCESS_ACTION
        || metatype === DQ_ENTITY_SUCCESS_ACTION) {
        return {
          ...state,
          value: reducer ? reducer(state.value, action) : (action as DqLoadAllSuccessAction<T>).payload,
          loading: false,
          error: null,
          success: true,
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

    if (reducer) {
      const newValue = reducer(state.value, action);
      if (newValue !== state.value) {
        return { ...state, value: newValue };
      }
    }
    return state;
  };
}
