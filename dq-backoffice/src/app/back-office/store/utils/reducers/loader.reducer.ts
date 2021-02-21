import { Action } from '@ngrx/store';
import {
  DqEntity,
  initializeState,
} from '../../state';
import { DqActions } from '../actions';

const initialLoaderState = (): DqEntity<any> => ({
  loading: false,
  error: null,
  success: false,
  value: null,
});

export function dqLoaderReducer<T>(
  type: string,
  reducer?: (state: T, action: Action) => T,
): (state: DqEntity<T>, action: DqActions.DqLoaderAction) => DqEntity<T> {
  return (
    state: DqEntity<T> = initialLoaderState(),
    action: DqActions.DqLoaderAction,
  ): DqEntity<T> => {
    if (
      action.meta
      && action.feature === type
    ) {
      const metatype = action.meta;

      if (metatype === DqActions.DQ_ALL_LOAD_ACTION
        || metatype === DqActions.DQ_ENTITY_LOAD_ACTION
        || metatype === DqActions.DQ_EDIT_LOAD_ACTION
        || metatype === DqActions.DQ_CREATE_LOAD_ACTION) {
        return {
          ...state,
          loading: true,
          success: false,
          value: reducer ? reducer(state.value, action) : state.value,
        };
      } if (metatype === DqActions.DQ_ALL_FAIL_ACTION
        || metatype === DqActions.DQ_ENTITY_FAIL_ACTION
        || metatype === DqActions.DQ_EDIT_FAIL_ACTION
        || metatype === DqActions.DQ_CREATE_FAIL_ACTION) {
        return {
          ...state,
          loading: false,
          error: (action as DqActions.DqLoadAllFailAction).payload,
          success: false,
          value: reducer ? reducer(state.value, action) : undefined,
        };
      } if (metatype === DqActions.DQ_ALL_SUCCESS_ACTION
        || metatype === DqActions.DQ_ENTITY_SUCCESS_ACTION
        || metatype === DqActions.DQ_EDIT_SUCCESS_ACTION
        || metatype === DqActions.DQ_CREATE_SUCCESS_ACTION) {
        return {
          ...state,
          value: reducer ? reducer(state.value, action) : (action as DqActions.DqLoadAllSuccessAction<T>).payload,
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
