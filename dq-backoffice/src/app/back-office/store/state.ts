/* eslint-disable max-classes-per-file */
import { DqPlayer } from '../../shared/models/dq-player';

export const DQ_STATE = 'dqstate';

export const PLAYERS_FEATURE = 'players';
export const PLAYERS_ALL_FEATURE = 'players_all';
export const PLAYERS_ENTITIES_FEATURE = 'players_entities';

export interface DqEntity<T> {
  value: T;

  loading: boolean;

  success: boolean;

  error: Error;
}

export interface DqEntityState<T> {
  entities: {
    [id: string]: DqEntity<T>;
  };
}

export interface DqFeatureState<T> {
  allEntities: DqEntity<T[]>;

  entitiesMap: DqEntityState<T>;
}

export default class DqStoreState {
  [PLAYERS_FEATURE]: DqFeatureState<DqPlayer>;
}

export interface DqFeatureWithState {
  [DQ_STATE]: DqStoreState;
}

export const initializeState = (): DqStoreState => ({
  players: {
    allEntities: {
      value: [], loading: false, success: false, error: null,
    },
    entitiesMap: {
      entities: {},
    },
  },
});
