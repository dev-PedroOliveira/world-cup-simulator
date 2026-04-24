function createRng(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
}

function decideWinner(homeGoals, awayGoals, rng) {
  if (homeGoals > awayGoals) return "home";
  if (awayGoals > homeGoals) return "away";
  return rng() < 0.5 ? "home" : "away";
}

function playMatch(homeTeam, awayTeam, rng, id) {
  let homeGoals = Math.floor(rng() * 5);
  let awayGoals = Math.floor(rng() * 5);
  const winnerSide = decideWinner(homeGoals, awayGoals, rng);

  let penaltiesHome = 0;
  let penaltiesAway = 0;

  // garante vencedor mesmo com empate (pênaltis simplificado)
  if (homeGoals === awayGoals) {
    penaltiesHome = Math.floor(rng() * 6);
    penaltiesAway = Math.floor(rng() * 6);
    while (penaltiesHome === penaltiesAway) {
      penaltiesAway = Math.floor(rng() * 6);
    }
  }

  return {
    id,
    homeId: homeTeam.id,
    awayId: awayTeam.id,
    homeName: homeTeam.name,
    awayName: awayTeam.name,
    homeGoals,
    awayGoals,
    goalsPenaltyTimeA: penaltiesHome,
    goalsPenaltyTimeB: penaltiesAway,
    winnerId: winnerSide === "home" ? homeTeam.id : awayTeam.id,
    loserId: winnerSide === "home" ? awayTeam.id : homeTeam.id,
  };
}

function getQualifiers(groups) {
  const map = new Map();
  for (const group of groups) {
    const first = group.standings?.[0];
    const second = group.standings?.[1];
    if (!first || !second) continue;
    map.set(`${group.name}1`, { id: first.teamId, name: first.teamName });
    map.set(`${group.name}2`, { id: second.teamId, name: second.teamName });
  }
  return map;
}

export function buildRoundOf16(groups) {
  const q = getQualifiers(groups);
  const pairs = [
    ["A1", "B2"],
    ["C1", "D2"],
    ["E1", "F2"],
    ["G1", "H2"],
    ["B1", "A2"],
    ["D1", "C2"],
    ["F1", "E2"],
    ["H1", "G2"],
  ];

  return pairs.map(([homeFrom, awayFrom], index) => ({
    id: `R16-${index + 1}`,
    homeFrom,
    awayFrom,
    home: q.get(homeFrom) ?? null,
    away: q.get(awayFrom) ?? null,
    result: null,
  }));
}

export function simulateKnockout(groups) {
  const qualifiers = getQualifiers(groups);
  const seed = (Date.now() + Math.floor(Math.random() * 1_000_000_000)) >>> 0;
  const rng = createRng(seed);

  const r16 = buildRoundOf16(groups).map((m) => {
    if (!m.home || !m.away) return m;
    return {
      ...m,
      result: playMatch(m.home, m.away, rng, m.id),
    };
  });

  const qfPairs = [
    ["R16-1", "R16-2"],
    ["R16-3", "R16-4"],
    ["R16-5", "R16-6"],
    ["R16-7", "R16-8"],
  ];

  const byR16 = new Map(r16.map((m) => [m.id, m.result]));
  const qf = qfPairs.map(([a, b], index) => {
    const ra = byR16.get(a);
    const rb = byR16.get(b);
    if (!ra || !rb) {
      return { id: `QF-${index + 1}`, homeFrom: `${a}W`, awayFrom: `${b}W`, result: null };
    }
    const home = { id: ra.winnerId, name: ra.winnerId === ra.homeId ? ra.homeName : ra.awayName };
    const away = { id: rb.winnerId, name: rb.winnerId === rb.homeId ? rb.homeName : rb.awayName };
    return {
      id: `QF-${index + 1}`,
      homeFrom: `${a}W`,
      awayFrom: `${b}W`,
      result: playMatch(home, away, rng, `QF-${index + 1}`),
    };
  });

  const byQf = new Map(qf.map((m) => [m.id, m.result]));
  const sfPairs = [
    ["QF-1", "QF-2"],
    ["QF-3", "QF-4"],
  ];
  const sf = sfPairs.map(([a, b], index) => {
    const ra = byQf.get(a);
    const rb = byQf.get(b);
    if (!ra || !rb) {
      return { id: `SF-${index + 1}`, homeFrom: `${a}W`, awayFrom: `${b}W`, result: null };
    }
    const home = { id: ra.winnerId, name: ra.winnerId === ra.homeId ? ra.homeName : ra.awayName };
    const away = { id: rb.winnerId, name: rb.winnerId === rb.homeId ? rb.homeName : rb.awayName };
    return {
      id: `SF-${index + 1}`,
      homeFrom: `${a}W`,
      awayFrom: `${b}W`,
      result: playMatch(home, away, rng, `SF-${index + 1}`),
    };
  });

  const bySf = new Map(sf.map((m) => [m.id, m.result]));
  const sf1 = bySf.get("SF-1");
  const sf2 = bySf.get("SF-2");

  const thirdPlace =
    sf1 && sf2
      ? [
          {
            id: "3P-1",
            homeFrom: "SF-1L",
            awayFrom: "SF-2L",
            result: playMatch(
              { id: sf1.loserId, name: sf1.loserId === sf1.homeId ? sf1.homeName : sf1.awayName },
              { id: sf2.loserId, name: sf2.loserId === sf2.homeId ? sf2.homeName : sf2.awayName },
              rng,
              "3P-1"
            ),
          },
        ]
      : [{ id: "3P-1", homeFrom: "SF-1L", awayFrom: "SF-2L", result: null }];

  const final =
    sf1 && sf2
      ? [
          {
            id: "F-1",
            homeFrom: "SF-1W",
            awayFrom: "SF-2W",
            result: playMatch(
              { id: sf1.winnerId, name: sf1.winnerId === sf1.homeId ? sf1.homeName : sf1.awayName },
              { id: sf2.winnerId, name: sf2.winnerId === sf2.homeId ? sf2.homeName : sf2.awayName },
              rng,
              "F-1"
            ),
          },
        ]
      : [{ id: "F-1", homeFrom: "SF-1W", awayFrom: "SF-2W", result: null }];

  const championId = final[0]?.result?.winnerId ?? null;
  const championName =
    final[0]?.result?.winnerId === final[0]?.result?.homeId
      ? final[0]?.result?.homeName
      : final[0]?.result?.winnerId === final[0]?.result?.awayId
        ? final[0]?.result?.awayName
        : null;

  return {
    rounds: {
      roundOf16: r16,
      quarterFinal: qf,
      semiFinal: sf,
      thirdPlace,
      final,
    },
    champion: championId ? { id: championId, name: championName } : null,
  };
}

