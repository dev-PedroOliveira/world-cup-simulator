import { useWorldCup } from "../features/world-cup/hooks/useWorldCup";
import { KnockoutBracket } from "../features/world-cup/components/KnockoutBracket";
import { useState } from "react";

export function HomePage() {
  const { state, dispatch } = useWorldCup();

  const [showGroups, setShowGroups] = useState(false);
  
  const [loadingGroups, setLoadingGroups] = useState(false);

  const r16Count = state.knockoutRounds?.roundOf16?.length ?? 0;
  const finalMatch = state.knockoutRounds?.final?.[0]?.result ?? null;

  return (
    <section>
      <header className="hero">
        <span className="badge">Status: {state.status}</span>
        <h1>Simulador de Copa do Mundo</h1>
      </header>

      <section className="grid">
  <article className="card">
    <h2>Estado inicial</h2>
    <p>{state.teams.length} times carregados.</p>
    <p>{state.groups.length} grupos montados.</p>
    <p>{r16Count} jogos de oitavas criados.</p>

    <div className="actions">
      <button
        className="primary-button"
        type="button"
        disabled={loadingGroups || state.status !== "ready" || state.groups.length === 0}
        onClick={async () => {
          setLoadingGroups(true);
          dispatch({ type: "SIMULATE_GROUP_STAGE" });
          setShowGroups(true);
          setLoadingGroups(false);
        }}
      >
        Simular fase de grupos
      </button>

      <button
        className="secondary-button"
        type="button"
        disabled={state.status !== "ready" || state.groups.some((g) => g.standings.length < 2)}
        onClick={() => dispatch({ type: "SIMULATE_KNOCKOUT_STAGE" })}
      >
        Simular mata-mata
      </button>

      <button
        className="secondary-button"
        type="button"
        disabled={!finalMatch || state.finalSent}
        onClick={async () => {
          const payload = {
            equipeA: finalMatch.homeId,
            equipeB: finalMatch.awayId,
            golsEquipeA: finalMatch.homeGoals,
            golsEquipeB: finalMatch.awayGoals,
            golsPenaltyTimeA: finalMatch.goalsPenaltyTimeA ?? 0,
            golsPenaltyTimeB: finalMatch.goalsPenaltyTimeB ?? 0,
          };

          console.log({ payload });
          dispatch({ type: "FINAL_SENT" });
        }}
      >
        Enviar resultado da final
      </button>
    </div>
  </article>
</section>
      {state.champion ? (
        <article className="card">
          <h3>Campeão</h3>
            <p>{state.champion.name}</p>
            {state.finalSent ? <p>Resultado enviado para a API.</p> : null}
        </article>
      ) : null}

      <KnockoutBracket rounds={state.knockoutRounds} groups={state.groups} />
      {showGroups && state.groups.length ? (
        <section className="card fade-in">
          <h3>Fase de grupos (A–H)</h3>
          <div className="grid">
            {state.groups.map((group) => (
              <article key={group.name} className="card">
                <h4>Grupo {group.name}</h4>
                <p>{group.matches.length} jogos (3 rodadas).</p>
                <ol className="list">
                  {group.standings.slice(0, 4).map((row) => (
                    <li key={row.teamId}>
                      {row.teamName} — {row.pts} pts (SG {row.gd}, GP {row.gf})
                    </li>
                  ))}
                </ol>

                {group.rounds?.length ? (
                  <div className="group-rounds">
                    {group.rounds.map((round) => (
                      <div key={round.round} className="group-round">
                        <div className="group-round-title">Rodada {round.round}</div>
                        {round.matches.map((m) => (
                          <div key={m.id} className="group-match">
                            <span className="group-team">{m.homeName}</span>
                            <span className="group-score">
                              {m.homeGoals == null ? "—" : `${m.homeGoals}–${m.awayGoals}`}
                            </span>
                            <span className="group-team">{m.awayName}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
