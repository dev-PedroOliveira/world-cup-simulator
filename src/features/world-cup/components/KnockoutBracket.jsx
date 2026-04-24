function MatchCard({ title, match, compact = false }) {
  const result = match?.result;
  const pens =
    result && (result.goalsPenaltyTimeA ?? 0) + (result.goalsPenaltyTimeB ?? 0) > 0
      ? ` (pênaltis ${result.goalsPenaltyTimeA}–${result.goalsPenaltyTimeB})`
      : "";

  return (
    <div className={compact ? "match-card compact" : "match-card"}>
      <div className="match-title">{title}</div>
      <div className="match-row">
        <span className={result?.winnerId === result?.homeId ? "match-team winner" : "match-team"}>
          {result?.homeName ?? match?.homeFrom ?? "-"}
        </span>
        <div className="match-score-div">
          <span className="match-score">{result ? `${result.homeGoals}–${result.awayGoals}` : "—"}</span>
          <span className="match-score-penalty">{pens}</span>

        </div>
        <span className={result?.winnerId === result?.awayId ? "match-team winner" : "match-team"}>
          {result?.awayName ?? match?.awayFrom ?? "-"}
        </span>
      </div>
    </div>
  );
}

function RoundColumn({ label, matches }) {
  return (
    <section className="round">
      <h4 className="round-title">{label}</h4>
      <div className="round-list">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            title={match.id}
            match={match}
            compact
          />
        ))}
      </div>
    </section>
  );
}

function BracketCore({ rounds }) {
  return (
    <div className="bracket-core">

      {/* 1 - Oitavas ESQ */}
      <RoundColumn
        label="Oitavas"
        matches={(rounds.roundOf16 ?? []).slice(0, 4)}
      />

      {/* 2 - Quartas ESQ */}
      <RoundColumn
        label="Quartas"
        matches={(rounds.quarterFinal ?? []).slice(0, 2)}
      />

      {/* 3 - Semi ESQ */}
      <RoundColumn
        label="Semifinal"
        matches={(rounds.semiFinal ?? []).slice(0, 1)}
      />

      {/* 4 - CENTRO */}
      <div className="bracket-center">
        <section className="round center-round">
          <h4 className="round-title">Final</h4>
          <div className="round-list">
            {(rounds.final ?? []).map((match) => (
              <MatchCard key={match.id} title={match.id} match={match} />
            ))}
          </div>
        </section>

        <section className="round">
          <h4 className="round-title">3º lugar</h4>
          <div className="round-list">
            {(rounds.thirdPlace ?? []).map((match) => (
              <MatchCard key={match.id} title={match.id} match={match} />
            ))}
          </div>
        </section>
      </div>

      {/* 5 - Semi DIR */}
      <RoundColumn
        label="Semifinal"
        matches={(rounds.semiFinal ?? []).slice(1, 2)}
      />

      {/* 6 - Quartas DIR */}
      <RoundColumn
        label="Quartas"
        matches={(rounds.quarterFinal ?? []).slice(2, 4)}
      />

      {/* 7 - Oitavas DIR */}
      <RoundColumn
        label="Oitavas"
        matches={(rounds.roundOf16 ?? []).slice(4, 8)}
      />

    </div>
  );
}

export function KnockoutBracket({ rounds }) {
  if (!rounds) return null;

  return (
    <section className="card fade-in wrapper">
      <h3>Chave (mata-mata)</h3>
      <div className="wc-layout">
        <BracketCore rounds={rounds} />
      </div>
    </section>
  );
}

