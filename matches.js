const API_URL = "https://api.football-data.org/v4/matches";

async function loadMatches() {
  const container = document.getElementById("matches-list");

  if (!container) return;

  container.textContent = "O‘yinlar yuklanmoqda...";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("O‘yinlarni yuklab bo‘lmadi");
    }

    const data = await response.json();

    container.replaceChildren();

    if (!data.matches || data.matches.length === 0) {
      container.textContent = "Hozircha o‘yinlar topilmadi.";
      return;
    }

    data.matches.forEach((match) => {
      const card = document.createElement("div");
      const teams = document.createElement("h3");
      const score = document.createElement("p");
      const status = document.createElement("p");

      teams.textContent =
        ${match.homeTeam.name} — ${match.awayTeam.name};

      const result = match.score.fullTime;

      score.textContent =
        result.home !== null && result.away !== null
          ? ${result.home} : ${result.away}
          : "Hisob hali yo‘q";

      status.textContent =
        match.status === "IN_PLAY" ||
        match.status === "LIVE" ||
        match.status === "PAUSED"
          ? "🔴 Jonli"
          : match.status === "FINISHED"
          ? "Yakunlangan"
          : "Boshlanmagan";

      card.append(teams, score, status);
      container.appendChild(card);
    });
  } catch (error) {
    container.textContent =
      "O‘yinlarni yuklashda xatolik yuz berdi.";
    console.error(error);
  }
}

loadMatches();
