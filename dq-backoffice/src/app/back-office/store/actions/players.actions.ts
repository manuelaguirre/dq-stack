/* eslint-disable max-classes-per-file */
import { createAction, props } from '@ngrx/store';
import { DqPlayer } from '../../../shared/models/dq-player';
import {
  DqLoadAllFailAction,
  DqLoadAllLoadAction,
  DqLoadAllSuccessAction,
  DqLoadOneFailAction,
  DqLoadOneLoadAction,
  DqLoadOneSuccessAction,
} from '../utils/loader.actions';

export const DQ_GET_PLAYERS = '[Player] - Get Players';

export const DQ_GET_PLAYERS_SUCCESS = '[Player] - Get Players Success';

export const DQ_GET_PLAYERS_FAIL = '[Player] - Get Players Error';

export class GetPlayersAction extends DqLoadAllLoadAction {
  constructor() {
    super(DQ_GET_PLAYERS);
  }
}

export class GetPlayersSuccessAction extends DqLoadAllSuccessAction<DqPlayer> {
  constructor(public payload: DqPlayer[]) {
    super(DQ_GET_PLAYERS_SUCCESS, payload);
  }
}

export class GetPlayersErrorAction extends DqLoadAllFailAction {
  constructor(public payload: Error) {
    super(DQ_GET_PLAYERS_SUCCESS, payload);
  }
}

export const DQ_GET_PLAYER = '[Player] - Get Player';

export const DQ_GET_PLAYER_SUCCESS = '[Player] - Get Player Success';

export const DQ_GET_PLAYER_FAIL = '[Player] - Get Player Error';

export class GetPlayerAction extends DqLoadOneLoadAction {
  constructor(public id: string) {
    super(DQ_GET_PLAYER, id);
  }
}

export class GetPlayerSuccessAction extends DqLoadOneSuccessAction<DqPlayer> {
  constructor(public id: string, public payload: DqPlayer) {
    super(DQ_GET_PLAYER_SUCCESS, id, payload);
  }
}

export class GetPlayerErrorAction extends DqLoadOneFailAction {
  constructor(public id: string, public payload: Error) {
    super(DQ_GET_PLAYER_SUCCESS, id, payload);
  }
}

// // Edit player
// export const EditPlayerAction = createAction(
//   '[Player] - Edit Player',
//   props<{ playerId: string; player: Partial<DqPlayer>; }>(),
// );

// export const SuccessEditPlayerAction = createAction(
//   '[Player] - Sucess Edit Player',
//   props<{ player: DqPlayer; }>(),
// );

// export const ErrorEditPlayerAction = createAction(
//   '[Player] - Edit Player Error',
//   props<{ error: Error; playerId: string; }>(),
// );

// // Create player
// export const CreatePlayerAction = createAction(
//   '[Player] - Create Player',
//   props<{ playerId: string; player: Partial<DqPlayer>; }>(),
// );

// export const SuccessCreatePlayerAction = createAction(
//   '[Player] - Sucess Create Player',
//   props<{ player: DqPlayer; }>(),
// );

// export const ErrorCreatePlayerAction = createAction(
//   '[Player] - Create Player Error',
//   props<{ error: Error; playerId: string; }>(),
// );

// // Delete player
// export const DeletePlayerAction = createAction(
//   '[Player] - Delete Player',
//   props<{ playerId: string; }>(),
// );

// export const SuccessDeletePlayerAction = createAction(
//   '[Player] - Sucess Delete Player',
//   props<{ playerId: string; }>(),
// );

// export const ErrorDeletePlayerAction = createAction(
//   '[Player] - Delete Player Error',
//   props<{ playerId: string; error: Error; }>(),
// );

export type DqPlayersActions =
| GetPlayersAction
| GetPlayersSuccessAction
| GetPlayersErrorAction
| GetPlayerAction
| GetPlayerSuccessAction
| GetPlayerErrorAction;
// | typeof EditPlayerAction
// | typeof SuccessEditPlayerAction
// | typeof ErrorEditPlayerAction
// | typeof CreatePlayerAction
// | typeof SuccessCreatePlayerAction
// | typeof ErrorCreatePlayerAction
// | typeof DeletePlayerAction
// | typeof SuccessDeletePlayerAction
// | typeof ErrorDeletePlayerAction;
