// Gaming Wellness AI - Interactive Dashboard
const metrics = {
  wellnessScore: null,
  weeklyPlaytime: null,
  gamesAnalyzed: null,
  lastInsight: null,
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("🎮 Gaming Wellness AI Dashboard Loaded");

  // Add some interactive elements
  const metricCards = document.querySelectorAll(".metric-card");
  metricCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.3s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });

  // Future: Connect to actual AWS API endpoints
  console.log("Ready to connect to League API and Bedrock services");
});

// Placeholder functions for future API integration
async function fetchAnalysis(summonerName, tagLine, region) {
  const errorEl = document.getElementById("error");
  if (errorEl) errorEl.style.display = "none";
  try {
    const resp = await fetch("http://127.0.0.1:5000/api/player/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summonerName, tagLine, region, count: 5 }),
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || `Request failed: ${resp.status}`);
    }
    return await resp.json();
  } catch (err) {
    console.error(err);
    if (errorEl) {
      errorEl.textContent = String(err);
      errorEl.style.display = "block";
    }
    throw err;
  }
}

function statusFromScore(score) {
  if (score == null) return "—";
  if (score >= 85) return "Excellent Balance!";
  if (score >= 70) return "Good Balance";
  if (score >= 55) return "Needs Breaks";
  return "Consider Rest";
}

function updateDashboard(payload) {
  const { metrics: m, matches, player, insight } = payload || {};
  const scoreEl = document.getElementById("wellnessScore");
  const playtimeEl = document.getElementById("totalPlaytime");
  const statusEl = document.getElementById("statusText");
  const aiEl = document.getElementById("aiInsight");

  if (scoreEl)
    scoreEl.textContent =
      m && m.wellness_score != null ? String(m.wellness_score) : "--";
  if (playtimeEl)
    playtimeEl.textContent =
      m && m.total_playtime_hours != null
        ? `${m.total_playtime_hours} hrs`
        : "-- hrs";
  if (statusEl) statusEl.textContent = statusFromScore(m && m.wellness_score);
  if (aiEl) aiEl.textContent = insight || "—";
}

// Wire up form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyze-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const summonerName = document.getElementById("summonerName").value.trim();
    const tagLine = document.getElementById("tagLine").value.trim();
    const region = document.getElementById("region").value;
    if (!summonerName || !tagLine) return;
    const button = document.getElementById("analyze-btn");
    const prev = button.textContent;
    button.textContent = "Analyzing…";
    button.disabled = true;
    try {
      const data = await fetchAnalysis(summonerName, tagLine, region);
      updateDashboard(data);
    } finally {
      button.textContent = prev;
      button.disabled = false;
    }
  });
});
