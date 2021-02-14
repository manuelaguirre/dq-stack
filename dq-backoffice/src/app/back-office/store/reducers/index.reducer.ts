import {
  ActionReducerMap,
  ActionReducer,
  MetaReducer,
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import DqStoreState from '../state';
import * as PlayerReducer from './players.reducer';

export const reducers: ActionReducerMap<DqStoreState> = {
  players: PlayerReducer.reducer,
};

export function logger(reducer: ActionReducer<DqStoreState>): ActionReducer<DqStoreState> {
  return (state: DqStoreState, action: any): DqStoreState => {
    console.log('[@DQ state]', state);
    console.log('[@DQ action]', action);
    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<DqStoreState>[] = !environment.production
  ? [logger]
  : [];
