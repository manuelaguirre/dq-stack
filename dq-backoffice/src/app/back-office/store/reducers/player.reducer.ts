import { DqPlayer } from '../../../shared/models/dq-player';
import { DqBackOfficeActions } from '../actions';

const initialState: DqPlayer = undefined;

export function reducer(
  state = initialState,
  action: DqBackOfficeActions.DqPlayersActions,
): DqPlayer {
  switch (action.type) {
    case DqBackOfficeActions.DQ_GET_PLAYER_SUCCESS
    || DqBackOfficeActions.DQ_EDIT_PLAYER_SUCCESS
    || DqBackOfficeActions.DQ_CREATE_PLAYER_SUCCESS: {
      return (action as DqBackOfficeActions.GetPlayerSuccessAction).payload;
    }
    case DqBackOfficeActions.DQ_GET_PLAYER_FAIL
    || DqBackOfficeActions.DQ_EDIT_PLAYER_FAIL
    || DqBackOfficeActions.DQ_CREATE_PLAYER_FAIL: {
      return initialState;
    }
    default: {
      return state;
    }
  }
  return state;
}
