import {
  MemoizedSelector, createSelector,
} from '@ngrx/store';
import { DqPlayer } from '../../../shared/models/dq-player';
import { getDqFeatureState } from './feature.selector';
import DqStoreState, {
  DqEntity, DqFeatureState, DqFeatureWithState, PLAYERS_FEATURE,
} from '../state';
import { DqSelectors } from '../utils/selectors';

export const getPlayersState: MemoizedSelector<
DqFeatureWithState,
DqFeatureState<DqPlayer>
> = createSelector(
  getDqFeatureState,
  (state: DqStoreState) => state[PLAYERS_FEATURE],
);

export const getAllPlayersState: MemoizedSelector<
DqFeatureWithState,
DqEntity<DqPlayer[]>
> = createSelector(
  getPlayersState,
  (state: DqFeatureState<DqPlayer>) => DqSelectors.dqFeatureAllEntitiesSelector<DqPlayer>(state),
);

export const getAllPlayersLoading: MemoizedSelector<
DqFeatureWithState,
boolean
> = createSelector(
  getAllPlayersState,
  (state: DqEntity<DqPlayer[]>) => DqSelectors.dqLoaderLoadingSelector<DqPlayer[]>(state),
);

export const getAllPlayersValue: MemoizedSelector<
DqFeatureWithState,
DqPlayer[]
> = createSelector(
  getAllPlayersState,
  (state: DqEntity<DqPlayer[]>) => DqSelectors.dqLoaderValueSelector<DqPlayer[]>(state),
);

export const getPlayerState = (playerId: string): MemoizedSelector<
DqFeatureWithState,
DqEntity<DqPlayer>
> => createSelector(
  getPlayersState,
  (state: DqFeatureState<DqPlayer>) => DqSelectors.dqEntityLoaderSelector<DqPlayer>(state.entitiesMap, playerId),
);

export const getPlayerLoading = (playerId: string): MemoizedSelector<
DqFeatureWithState,
boolean
> => createSelector(
  getPlayerState(playerId),
  (state: DqEntity<DqPlayer>) => DqSelectors.dqLoaderLoadingSelector<DqPlayer>(state),
);

export const getPlayerValue = (playerId: string): MemoizedSelector<
DqFeatureWithState,
DqPlayer
> => createSelector(
  getPlayerState(playerId),
  (state: DqEntity<DqPlayer>) => DqSelectors.dqLoaderValueSelector<DqPlayer>(state),
);
