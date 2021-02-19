import { DqPlayer } from '../../../shared/models/dq-player';
import { DqBackOfficeActions } from '../actions';
import { DqPlayersActions, GetPlayerSuccessAction } from '../actions/players.actions';

const initialState: DqPlayer = undefined;

export function reducer(
  state = initialState,
  action: DqPlayersActions,
): DqPlayer {
  switch (action.type) {
    case DqBackOfficeActions.DQ_GET_PLAYER_SUCCESS: {
      return (action as GetPlayerSuccessAction).payload;
    }
    case DqBackOfficeActions.DQ_GET_PLAYER_FAIL: {
      return initialState;
    }
    default: {
      return state;
    }
  }
  return state;
}
