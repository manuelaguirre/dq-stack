import { DqPlayer } from '../../../shared/models/dq-player';
import { DqBackOfficeActions } from '../actions';

const initialState: DqPlayer[] = [];

export function reducer(
  state = initialState,
  action: DqBackOfficeActions.DqPlayersActions,
): DqPlayer[] {
  switch (action.type) {
    case DqBackOfficeActions.DQ_GET_PLAYERS_SUCCESS: {
      return (action as DqBackOfficeActions.GetPlayersSuccessAction).payload;
    }
    case DqBackOfficeActions.DQ_GET_PLAYERS_FAIL: {
      return initialState;
    }
    default: {
      return state;
    }
  }
  return state;
}
