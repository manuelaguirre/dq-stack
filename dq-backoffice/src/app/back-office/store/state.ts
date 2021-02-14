import { DqPlayer } from '../../shared/models/dq-player';

export interface DqAllEntities<T> {
  entities: T[];

  loading: boolean;

  success: boolean;

  error: Error;
}

export interface DqEntity<T> {
  value: T;

  loading: boolean;

  success: boolean;

  error: Error;
}

export interface DqEntitiesState<T> {
  allEntities: DqAllEntities<T>;

  entitiesMap: {
    [id: string]: DqEntity<T>;
  };
}

export default class DqStoreState {
  players: DqEntitiesState<DqPlayer>;
}

export const initializeState = (): DqStoreState => ({
  players: {
    allEntities: {
      entities: [], loading: false, success: false, error: null,
    },
    entitiesMap: {},
  },
});
