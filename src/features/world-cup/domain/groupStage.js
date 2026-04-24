function createRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

export function buildGroupRounds(group) {
  const teams = group.teams;
  if (teams.length !== 4) return [];

  const [t1, t2, t3, t4] = teams;
  const mk = (home, away, round) => ({
    id: `${group.name}-R${round}-${home.id}-${away.id}`,
    round,
    homeId: home.id,
    awayId: away.id,
    homeName: home.name,
    awayName: away.name,
    homeGoals: null,
    awayGoals: null,
  });

  return [
    { round: 1, matches: [mk(t1, t2, 1), mk(t3, t4, 1)] },
    { round: 2, matches: [mk(t1, t3, 2), mk(t2, t4, 2)] },
    { round: 3, matches: [mk(t1, t4, 3), mk(t2, t3, 3)] },
  ];
}

export function flattenRounds(rounds) {
  return rounds.flatMap((r) => r.matches);
}

export function computeStandings(group) {
  const byId = new Map(
    group.teams.map((team) => [
      team.id,
      {
        teamId: team.id,
        teamName: team.name,
        pts: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        w: 0,
        d: 0,
        l: 0,
      },
    ])
  );

  for (const match of group.matches) {
    if (match.homeGoals == null || match.awayGoals == null) continue;

    const home = byId.get(match.homeId);
    const away = byId.get(match.awayId);
    if (!home || !away) continue;

    home.gf += match.homeGoals;
    home.ga += match.awayGoals;
    away.gf += match.awayGoals;
    away.ga += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.w += 1;
      home.pts += 3;
      away.l += 1;
    } else if (match.homeGoals < match.awayGoals) {
      away.w += 1;
      away.pts += 3;
      home.l += 1;
    } else {
      home.d += 1;
      away.d += 1;
      home.pts += 1;
      away.pts += 1;
    }
  }

  const table = Array.from(byId.values()).map((row) => ({
    ...row,
    gd: row.gf - row.ga,
  }));

  const baseSort = (a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return 0;
  };

  table.sort(baseSort);

  return table;
}

export function simulateGroup(group) {
  const groupSalt = Array.from(group.name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const seed =
    (Date.now() + Math.floor(Math.random() * 1_000_000_000) + groupSalt) >>> 0;
  const rng = createRng(seed);

  const matches = group.matches.map((match) => {
    if (match.homeGoals != null && match.awayGoals != null) return match;

    return {
      ...match,
      homeGoals: Math.floor(rng() * 5),
      awayGoals: Math.floor(rng() * 5),
    };
  });

  const byMatchId = new Map(matches.map((m) => [m.id, m]));
  const rounds = (group.rounds ?? []).map((round) => ({
    ...round,
    matches: round.matches.map((m) => byMatchId.get(m.id) ?? m),
  }));

  const nextGroup = {
    ...group,
    rounds,
    matches,
  };

  const standings = computeStandings(nextGroup);

  // critério 3: sorteio (randômico) quando empatar em pontos e saldo
  standings.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return rng() < 0.5 ? -1 : 1;
  });

  return {
    ...nextGroup,
    standings,
  };
}

