import {
  createFeatureSelector, MemoizedSelector, createSelector,
} from '@ngrx/store';
import { DqPlayer } from '../../../shared/models/dq-player';
import DqStoreState, { DqEntitiesState, DqAllEntities, DqEntity } from '../state';

export const getPlayersState = createFeatureSelector<DqEntitiesState<DqPlayer>>('players');

export const getAllPlayersState: MemoizedSelector<
DqStoreState,
DqAllEntities<DqPlayer>
> = createSelector(getPlayersState, (state: DqEntitiesState<DqPlayer>) => state.allEntities);

export const getAllPlayersLoading: MemoizedSelector<
DqStoreState,
boolean
> = createSelector(getAllPlayersState, (state: DqAllEntities<DqPlayer>) => state.loading);

export const getAllPlayersValue: MemoizedSelector<
DqStoreState,
DqPlayer[]
> = createSelector(getAllPlayersState, (state: DqAllEntities<DqPlayer>) => state.entities);

export const getPlayerState = (playerId: string): MemoizedSelector<
DqStoreState,
DqEntity<DqPlayer>
> => createSelector(getPlayersState, (state: DqEntitiesState<DqPlayer>) => state.entitiesMap[playerId]);

export const getPlayerLoading = (playerId: string): MemoizedSelector<
DqStoreState,
boolean
> => createSelector(getPlayerState(playerId), (state: DqEntity<DqPlayer>) => state.loading);

export const getPlayerValue = (playerId: string): MemoizedSelector<
DqStoreState,
DqPlayer
> => createSelector(getPlayerState(playerId), (state: DqEntity<DqPlayer>) => state.value);
