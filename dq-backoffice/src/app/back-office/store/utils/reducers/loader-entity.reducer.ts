import { Action } from '@ngrx/store';
import {
  DqEntityMap,
} from '../../state';
import { DqActions } from '../actions';
import { dqEntitiesReducer } from './entity.reducer';
import { dqLoaderReducer } from './loader.reducer';

export const initialEntityState: DqEntityMap<any> = { entities: {} };

export function dqLoaderEntitiesReducer<T>(
  type: string,
  reducer?: (state: T, action: Action) => T,
): (state: DqEntityMap<T>, action: DqActions.DqLoadOneLoadAction) => DqEntityMap<T> {
  return dqEntitiesReducer(type, dqLoaderReducer(type, reducer));
}
