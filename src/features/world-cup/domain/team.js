export function toTeam(apiTeam) {
  return {
    id: apiTeam.token,
    name: apiTeam.nome,
  };
}

