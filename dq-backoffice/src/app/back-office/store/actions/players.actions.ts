/* eslint-disable max-classes-per-file */
import { DqPlayer } from '../../../shared/models/dq-player';
import { PLAYERS_ALL_FEATURE, PLAYERS_ENTITIES_FEATURE } from '../state';
import { DqActions } from '../utils/actions';

export const DQ_GET_PLAYERS = '[Player] - Get Players';

export const DQ_GET_PLAYERS_SUCCESS = '[Player] - Get Players Success';

export const DQ_GET_PLAYERS_FAIL = '[Player] - Get Players Error';

export class GetPlayersAction extends DqActions.DqLoadAllLoadAction {
  constructor() {
    super(DQ_GET_PLAYERS, PLAYERS_ALL_FEATURE);
  }
}

export class GetPlayersSuccessAction extends DqActions.DqLoadAllSuccessAction<DqPlayer[]> {
  constructor(public payload: DqPlayer[]) {
    super(DQ_GET_PLAYERS_SUCCESS, PLAYERS_ALL_FEATURE, payload);
  }
}

export class GetPlayersErrorAction extends DqActions.DqLoadAllFailAction {
  constructor(public payload: Error) {
    super(DQ_GET_PLAYERS_FAIL, PLAYERS_ALL_FEATURE, payload);
  }
}

export const DQ_GET_PLAYER = '[Player] - Get Player';

export const DQ_GET_PLAYER_SUCCESS = '[Player] - Get Player Success';

export const DQ_GET_PLAYER_FAIL = '[Player] - Get Player Error';

export class GetPlayerAction extends DqActions.DqLoadOneLoadAction {
  constructor(public id: string) {
    super(DQ_GET_PLAYER, PLAYERS_ENTITIES_FEATURE, id);
  }
}

export class GetPlayerSuccessAction extends DqActions.DqLoadOneSuccessAction<DqPlayer> {
  constructor(public id: string, public payload: DqPlayer) {
    super(DQ_GET_PLAYER_SUCCESS, PLAYERS_ENTITIES_FEATURE, id, payload);
  }
}

export class GetPlayerErrorAction extends DqActions.DqLoadOneFailAction {
  constructor(public id: string, public payload: Error) {
    super(DQ_GET_PLAYER_FAIL, PLAYERS_ENTITIES_FEATURE, id, payload);
  }
}

export const DQ_EDIT_PLAYER = '[Player] - Edit Player';

export const DQ_EDIT_PLAYER_SUCCESS = '[Player] - Edit Player Success';

export const DQ_EDIT_PLAYER_FAIL = '[Player] - Edit Player Error';

// Edit player
export class EditPlayerAction extends DqActions.DqEditOneLoadAction {
  constructor(public id: string, public player: Partial<DqPlayer>) {
    super(DQ_EDIT_PLAYER, PLAYERS_ENTITIES_FEATURE, id, player);
  }
}

export class EditPlayerSuccessAction extends DqActions.DqEditOneSuccessAction {
  constructor(public id: string, public payload: DqPlayer) {
    super(DQ_EDIT_PLAYER_SUCCESS, PLAYERS_ENTITIES_FEATURE, id, payload);
  }
}

export class EditPlayerErrorAction extends DqActions.DqEditOneFailAction {
  constructor(public id: string, public payload: Error) {
    super(DQ_EDIT_PLAYER_FAIL, PLAYERS_ENTITIES_FEATURE, id, payload);
  }
}

export const DQ_CREATE_PLAYER = '[Player] - Create Player';

export const DQ_CREATE_PLAYER_SUCCESS = '[Player] - Create Player Success';

export const DQ_CREATE_PLAYER_FAIL = '[Player] - Create Player Error';

// Create player
export class CreatePlayerAction extends DqActions.DqCreateOneLoadAction {
  constructor(public id: string, public player: Partial<DqPlayer>) {
    super(DQ_CREATE_PLAYER, PLAYERS_ENTITIES_FEATURE, id, player);
  }
}

export class CreatePlayerSuccessAction extends DqActions.DqCreateOneSuccessAction {
  constructor(public id: string, public payload: DqPlayer) {
    super(DQ_CREATE_PLAYER_SUCCESS, PLAYERS_ENTITIES_FEATURE, id, payload);
    console.log(payload);
  }
}

export class CreatePlayerErrorAction extends DqActions.DqCreateOneFailAction {
  constructor(public id: string, public payload: Error) {
    super(DQ_CREATE_PLAYER_FAIL, PLAYERS_ENTITIES_FEATURE, id, payload);
  }
}

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
| GetPlayerErrorAction
| EditPlayerAction
| EditPlayerSuccessAction
| EditPlayerErrorAction;
// | typeof CreatePlayerAction
// | typeof SuccessCreatePlayerAction
// | typeof ErrorCreatePlayerAction
// | typeof DeletePlayerAction
// | typeof SuccessDeletePlayerAction
// | typeof ErrorDeletePlayerAction;
