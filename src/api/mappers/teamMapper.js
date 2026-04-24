export function mapTeamResponseToEntity(teamResponse) {
  return {
    id: teamResponse.id,
    name: teamResponse.name,
    code: teamResponse.code,
    flag: teamResponse.flag,
    group: teamResponse.group ?? null,
  };
}
