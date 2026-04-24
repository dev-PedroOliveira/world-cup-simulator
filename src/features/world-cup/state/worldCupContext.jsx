import { createContext, useEffect, useMemo, useReducer } from "react";
import { initialWorldCupState, worldCupReducer } from "./worldCupReducer";
import { fetchTeams } from "../services/worldCupApi";

export const WorldCupContext = createContext({
  state: initialWorldCupState,
  dispatch: () => {},
});

export function WorldCupProvider({ children }) {
  const [state, dispatch] = useReducer(worldCupReducer, initialWorldCupState);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      dispatch({ type: "LOAD_START" });

      try {
        const teams = await fetchTeams();
        if (cancelled) return;
        dispatch({ type: "LOAD_SUCCESS", payload: { teams } });
      } catch (error) {
        if (cancelled) return;
        dispatch({
          type: "LOAD_ERROR",
          payload: { message: error instanceof Error ? error.message : String(error) },
        });
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <WorldCupContext.Provider value={value}>
      {children}
    </WorldCupContext.Provider>
  );
}
