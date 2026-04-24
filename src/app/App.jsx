import { WorldCupProvider } from "../features/world-cup/state/worldCupContext";
import { HomePage } from "../pages";

export function App() {
  return (
    <WorldCupProvider>
      <main className="app-shell">
        <HomePage />
      </main>
    </WorldCupProvider>
  );
}
