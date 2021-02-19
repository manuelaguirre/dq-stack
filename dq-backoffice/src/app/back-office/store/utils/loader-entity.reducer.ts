import { Action } from '@ngrx/store';
import {
  DqEntityState,
} from '../state';
import { entitiesReducer } from './entity.reducer';
import {
  DqLoadOneLoadAction,
} from './loader.actions';
import { loaderReducer } from './loader.reducer';

export const initialEntityState: DqEntityState<any> = { entities: {} };

export function loaderEntitiesReducer<T>(
  type: string,
  reducer?: (state: T, action: Action) => T,
): (state: DqEntityState<T>, action: DqLoadOneLoadAction) => DqEntityState<T> {
  return entitiesReducer(type, loaderReducer(type, reducer));
}
