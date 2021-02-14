import { createAction, props } from '@ngrx/store';
import { DqPlayer } from '../../../shared/models/dq-player';

// Get all players
export const GetPlayersAction = createAction('[Player] - Get Players');

export const SuccessGetPlayersAction = createAction(
  '[Player] - Sucess Get Players',
  props<{ players: DqPlayer[]; }>(),
);

export const ErrorGetPlayersAction = createAction('[Player] - Get Players Error', props<{ error: Error; }>());

// Get one player
export const GetPlayerAction = createAction('[Player] - Get Player', props<{ playerId: string; }>());

export const SuccessGetPlayerAction = createAction(
  '[Player] - Sucess Get Player',
  props<{ player: DqPlayer; }>(),
);

export const ErrorGetPlayerAction = createAction(
  '[Player] - Get Player Error',
  props<{ playerId: string; error: Error; }>(),
);

// Edit player
export const EditPlayerAction = createAction(
  '[Player] - Edit Player',
  props<{ playerId: string; player: Partial<DqPlayer>; }>(),
);

export const SuccessEditPlayerAction = createAction(
  '[Player] - Sucess Edit Player',
  props<{ player: DqPlayer; }>(),
);

export const ErrorEditPlayerAction = createAction(
  '[Player] - Edit Player Error',
  props<{ error: Error; playerId: string; }>(),
);

// Create player
export const CreatePlayerAction = createAction(
  '[Player] - Create Player',
  props<{ playerId: string; player: Partial<DqPlayer>; }>(),
);

export const SuccessCreatePlayerAction = createAction(
  '[Player] - Sucess Create Player',
  props<{ player: DqPlayer; }>(),
);

export const ErrorCreatePlayerAction = createAction(
  '[Player] - Create Player Error',
  props<{ error: Error; playerId: string; }>(),
);

// Delete player
export const DeletePlayerAction = createAction(
  '[Player] - Delete Player',
  props<{ playerId: string; }>(),
);

export const SuccessDeletePlayerAction = createAction(
  '[Player] - Sucess Delete Player',
  props<{ playerId: string; }>(),
);

export const ErrorDeletePlayerAction = createAction(
  '[Player] - Delete Player Error',
  props<{ playerId: string; error: Error; }>(),
);

export type DqPlayersActions =
| typeof GetPlayersAction
| typeof SuccessGetPlayersAction
| typeof ErrorGetPlayersAction
| typeof GetPlayerAction
| typeof SuccessGetPlayerAction
| typeof ErrorGetPlayerAction
| typeof EditPlayerAction
| typeof SuccessEditPlayerAction
| typeof ErrorEditPlayerAction
| typeof CreatePlayerAction
| typeof SuccessCreatePlayerAction
| typeof ErrorCreatePlayerAction
| typeof DeletePlayerAction
| typeof SuccessDeletePlayerAction
| typeof ErrorDeletePlayerAction;
