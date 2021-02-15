import { DqPlayer } from '../../../shared/models/dq-player';
import { DqBackOfficeActions } from '../actions';
import { DqPlayersActions } from '../actions/players.actions';
import { initializeState, DqEntitiesState } from '../state';

const initialState: DqEntitiesState<DqPlayer> = initializeState().players;

export function reducer(
  state = initialState,
  action: DqPlayersActions,
): DqEntitiesState<DqPlayer> {
  switch (action.type) {
    case DqBackOfficeActions.DQ_GET_PLAYER: {
      return {
        ...state,
        entitiesMap: {
          ...state.entitiesMap,
          [action.id]: {
            error: null, loading: true, success: false, value: null,
          },
        },
      };
    }
    case DqBackOfficeActions.DQ_GET_PLAYER_SUCCESS: {
      return {
        ...state,
        entitiesMap: {
          ...state.entitiesMap,
          [action.id]: {
            error: null, loading: false, success: true, value: action.payload,
          },
        },
      };
    }
    case DqBackOfficeActions.DQ_GET_PLAYER_FAIL: {
      return {
        ...state,
        entitiesMap: {
          ...state.entitiesMap,
          [action.id]: {
            error: action.error, loading: false, success: false, value: null,
          },
        },
      };
    }
    case DqBackOfficeActions.DQ_GET_PLAYERS: {
      return {
        ...state,
        allEntities: {
          ...state.allEntities, loading: true, success: false, error: null,
        },
      };
    }
    case DqBackOfficeActions.DQ_GET_PLAYERS_SUCCESS: {
      return {
        ...state,
        allEntities: {
          entities: action.payload,
          error: null,
          success: true,
          loading: false,
        },
      };
    }
    case DqBackOfficeActions.DQ_GET_PLAYERS_FAIL: {
      return {
        ...state,
        allEntities: {
          entities: [],
          error: action.error,
          success: false,
          loading: false,
        },
      };
    }
    // case DqBackOfficeActions.EditPlayerAction.type
    //   || DqBackOfficeActions.CreatePlayerAction.type
    //   || DqBackOfficeActions.DeletePlayerAction: {
    //   return {
    //     ...state,
    //     entitiesMap: {
    //       ...state.entitiesMap,
    //       [action.playerId]: {
    //         error: null, loading: true, success: false, value: null,
    //       },
    //     },
    //   };
    // }
    // case DqBackOfficeActions.SuccessEditPlayerAction.type: {
    //   const newState = {
    //     allEntities: {
    //       ...state.allEntities,
    //       entities: state.allEntities.entities.map((e) => (e._id === action.player._id ? action.player : e)),
    //     },
    //     entitiesMap: {
    //       ...state.entitiesMap,
    //       [action.player._id]: {
    //         ...state.entitiesMap[action.player._id],
    //         loading: false,
    //         value: action.player,
    //       },
    //     },
    //   };
    //   console.log(newState);
    //   return newState;
    // }
    // case DqBackOfficeActions.ErrorEditPlayerAction.type
    // || DqBackOfficeActions.ErrorCreatePlayerAction.type
    // || DqBackOfficeActions.ErrorDeletePlayerAction.type: {
    //   return {
    //     ...state,
    //     entitiesMap: {
    //       ...state.entitiesMap,
    //       [action.playerId]: {
    //         error: action.error, loading: false, success: false, value: null,
    //       },
    //     },
    //   };
    // }
    // case DqBackOfficeActions.SuccessCreatePlayerAction.type: {
    //   const newState = {
    //     allEntities: {
    //       ...state.allEntities,
    //       entities: [action.player].concat(state.allEntities.entities),
    //     },
    //     entitiesMap: {
    //       ...state.entitiesMap,
    //       [action.player._id]: {
    //         error: null, loading: false, success: true, value: action.player,
    //       },
    //       new: {
    //         error: null, loading: false, success: true, value: action.player,
    //       },
    //     },
    //   };
    //   return newState;
    // }
    // case DqBackOfficeActions.SuccessDeletePlayerAction.type: {
    //   const newState = {
    //     ...state,
    //   };
    //   const index = newState.allEntities.entities.findIndex((p) => p._id === action.playerId);
    //   newState.allEntities.entities.splice(index, 1);
    //   delete newState.entitiesMap[action.playerId];
    //   return newState;
    // }
    default: {
      return state;
    }
  }
  return state;
}
