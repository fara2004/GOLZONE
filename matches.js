
const API_URL = "https://api.football-data.org/v4/matches";

// API tokeningni shu yerga yoz
const API_TOKEN = "cea1d5dfa63a47b79d8ca4d9302cd10a";

async function loadMatches() {
  const container = document.getElementById("matches-list");

  if (!container) {
    console.error("matches-list elementi topilmadi!");
    return;
  }

  container.textContent = "⚽ O‘yinlar yuklanmoqda...";

  try {
    const response = await fetch(API_URL, {
      headers: {
        "X-Auth-Token": API_TOKEN
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("API ruxsati yo‘q. Token yoki tarifni tekshir.");
      }

      if (response.status === 401) {
        throw new Error("API token noto‘g‘ri.");
      }

      throw new Error(`API xatosi: ${response.status}`);
    }

    const data = await response.json();
    container.replaceChildren();

    if (!data.matches || data.matches.length === 0) {
      container.textContent = "Hozircha o‘yinlar topilmadi.";
      return;
    }

    data.matches.forEach((match) => {
      const card = document.createElement("div");
      card.className = "match-card";

      const teams = document.createElement("h3");
      teams.textContent =
        `${match.homeTeam?.name || "Uy jamoasi"} — ` +
        `${match.awayTeam?.name || "Mehmon jamoasi"}`;

      const score = document.createElement("p");
      const result = match.score?.fullTime;

      if (result?.home !== null &&
          result?.home !== undefined &&
          result?.away !== null &&
          result?.away !== undefined) {
        score.textContent = `Hisob: ${result.home} : ${result.away}`;
      } else {
        score.textContent = "Hisob: hali aniqlanmagan";
      }

      const status = document.createElement("p");
      const statusNames = {
        IN_PLAY: "🔴 Jonli",
        PAUSED: "⏸ Tanaffus",
        FINISHED: "✅ Tugagan",
        SCHEDULED: "🕒 Rejalashtirilgan",
        TIMED: "🕒 Boshlanishi kutilmoqda",
        POSTPONED: "📅 Qoldirilgan",
        SUSPENDED: "⏸ To‘xtatilgan",
        CANCELLED: "❌ Bekor qilingan"
      };

      status.textContent =
        statusNames[match.status] || match.status || "Noma’lum";

      const competition = document.createElement("p");
      competition.textContent =
        `🏆 ${match.competition?.name || "Musobaqa"}`;

      card.append(competition, teams, score, status);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("O‘yinlarni yuklash xatosi:", error);
    container.textContent = `Xatolik: ${error.message}`;
  }
}

loadMatches();

