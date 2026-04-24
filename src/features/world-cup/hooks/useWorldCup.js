import { useContext } from "react";
import { WorldCupContext } from "../state/worldCupContext";

export function useWorldCup() {
  const context = useContext(WorldCupContext);

  if (!context) {
    throw new Error("useWorldCup deve ser usado dentro de WorldCupProvider.");
  }

  return context;
}
