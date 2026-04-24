import { toTeam } from "../domain/team";

export async function fetchTeams() {
  const gitUser = import.meta.env.VITE_GIT_USER ?? "pedro";
  const url =
    "https://development-internship-api.geopostenergy.com/WorldCup/GetAllTeams";

  const response = await fetch(url, {
    headers: {
      "git-user": gitUser,
    },
  });

  if (!response.ok) {
    let body = null;
    try {
      body = await response.json();
    } catch {
      // ignore json parse errors
    }
    const details = body ? ` ${JSON.stringify(body)}` : "";
    throw new Error(`Falha ao carregar times (${response.status}).${details}`);
  }

  const payload = await response.json();
  return payload.map(toTeam);
}

export async function postTournamentResult() {
  throw new Error("Use postFinalResult(finalResult).");
}

export async function postFinalResult(finalResult) {
  const gitUser = import.meta.env.VITE_GIT_USER ?? "pedro";
  const url =
    "https://development-internship-api.geopostenergy.com/WorldCup/FinalResult";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "git-user": gitUser,
    },
    body: JSON.stringify(finalResult),
  });

  if (!response.ok) {
    let body = null;
    try {
      body = await response.json();
    } catch {
      // ignore json parse errors
    }
    const details = body ? ` ${JSON.stringify(body)}` : "";
    throw new Error(`Falha ao enviar final (${response.status}).${details}`);
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
