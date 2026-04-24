import { buildGroups } from "../domain/grouping";
import { simulateGroup } from "../domain/groupStage";
import { simulateKnockout } from "../domain/knockout";

export const initialWorldCupState = {
  status: "idle",
  teams: [],
  groups: [],
  knockoutRounds: null,
  champion: null,
  error: null,
  finalSent: false,
};

export function worldCupReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case "LOAD_SUCCESS":
      return {
        ...state,
        status: "ready",
        teams: action.payload.teams,
        groups: buildGroups(action.payload.teams),
        error: null,
      };
    case "SIMULATE_GROUP_STAGE":
      return {
        ...state,
        groups: state.groups.map(simulateGroup),
      };
    case "SIMULATE_KNOCKOUT_STAGE": {
      const { rounds, champion } = simulateKnockout(state.groups);
      return {
        ...state,
        knockoutRounds: rounds,
        champion,
        finalSent: false,
      };
    }
    case "FINAL_SENT":
      return { ...state, finalSent: true };
    case "LOAD_ERROR":
      return {
        ...state,
        status: "error",
        error: action.payload.message,
      };
    case "RESET_TOURNAMENT":
      return initialWorldCupState;
    default:
      return state;
  }
}
