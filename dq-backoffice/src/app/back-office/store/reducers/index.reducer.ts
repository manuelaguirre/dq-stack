import { InjectionToken, Provider } from '@angular/core';
import {
  ActionReducerMap,
  ActionReducer,
  MetaReducer,
  combineReducers,
} from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { DqPlayer } from '../../../shared/models/dq-player';
import DqStoreState, { PLAYERS_FEATURE, PLAYERS_ENTITIES_FEATURE, PLAYERS_ALL_FEATURE } from '../state';
import { dqLoaderEntitiesReducer } from '../utils/reducers/loader-entity.reducer';
import { dqLoaderReducer } from '../utils/reducers/loader.reducer';
import * as PlayersReducer from './all-players.reducer';
import * as PlayerReducer from './player.reducer';

export function getReducers(): ActionReducerMap<DqStoreState> {
  return {
    [PLAYERS_FEATURE]: combineReducers({
      allEntities: dqLoaderReducer<DqPlayer[]>(
        PLAYERS_ALL_FEATURE,
        PlayersReducer.reducer,
      ),
      entitiesMap: dqLoaderEntitiesReducer<DqPlayer>(
        PLAYERS_ENTITIES_FEATURE,
        PlayerReducer.reducer,
      ),
    }),
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<
DqStoreState
>> = new InjectionToken<ActionReducerMap<DqStoreState>>(
  'DqStateReducer',
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
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
