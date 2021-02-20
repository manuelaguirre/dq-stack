import { Action } from '@ngrx/store';
import {
  DqEntityMap,
} from '../../state';
import { dqEntitiesReducer } from './entity.reducer';
import {
  DqLoadOneLoadAction,
} from '../actions/loader.actions';
import { dqLoaderReducer } from './loader.reducer';

export const initialEntityState: DqEntityMap<any> = { entities: {} };

export function dqLoaderEntitiesReducer<T>(
  type: string,
  reducer?: (state: T, action: Action) => T,
): (state: DqEntityMap<T>, action: DqLoadOneLoadAction) => DqEntityMap<T> {
  return dqEntitiesReducer(type, dqLoaderReducer(type, reducer));
}
