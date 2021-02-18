import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import DqStoreState, { DqFeatureWithState, DQ_STATE } from '../state';

export const getDqFeatureState: MemoizedSelector<
DqFeatureWithState,
DqStoreState
> = createFeatureSelector<DqStoreState>(DQ_STATE);
