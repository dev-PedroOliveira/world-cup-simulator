import { GROUP_NAMES, TEAMS_PER_GROUP } from "../../../shared/constants/tournament";
import { buildGroupRounds, computeStandings, flattenRounds } from "./groupStage";

function shuffleInPlace(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function buildGroups(teams) {
  const shuffled = shuffleInPlace([...teams]);
  const groups = GROUP_NAMES.map((name) => ({
    name,
    teams: [],
    rounds: [],
    matches: [],
    standings: [],
  }));

  for (let i = 0; i < shuffled.length; i += 1) {
    const groupIndex = Math.floor(i / TEAMS_PER_GROUP);
    if (!groups[groupIndex]) break;
    groups[groupIndex].teams.push(shuffled[i]);
  }

  return groups.map((group) => {
    const rounds = buildGroupRounds(group);
    const matches = flattenRounds(rounds);
    const withMatches = { ...group, rounds, matches };
    return { ...withMatches, standings: computeStandings(withMatches) };
  });
}

