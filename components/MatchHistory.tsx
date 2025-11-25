"use client";

import { useEffect, useState } from "react";

type MatchSummary = {
  matchId: string;
  championId: number;
  role: string;
  lane: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  gameDuration: number;
  csPerMin: number;
  goldPerMin: number;
  items: number[];
};

export default function MatchHistory({ puuid }: { puuid: string }) {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/matches/${puuid}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("Matches backend error", res.status, text);
          setError("Impossible de charger l'historique.");
          return;
        }
        const data = await res.json();
        setMatches(data);
      } catch (e) {
        console.error(e);
        setError("Erreur réseau.");
      } finally {
        setLoading(false);
      }
    }
    if (puuid) load();
  }, [puuid]);

  if (loading) return <div style={{ marginTop: 16 }}>Chargement des games…</div>;
  if (error) return <div style={{ marginTop: 16, color: "red" }}>{error}</div>;
  if (!matches.length) return <div style={{ marginTop: 16 }}>Aucune game récente.</div>;

  return (
    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
      {matches.map((m) => {
        const kda = m.deaths === 0 ? "Perfect" : ((m.kills + m.assists) / m.deaths).toFixed(2);
        const durationMin = (m.gameDuration / 60).toFixed(0);

        return (
          <div
            key={m.matchId}
            style={{
              padding: 10,
              borderRadius: 8,
              background: m.win ? "#16344f" : "#4f1616",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>
                {m.win ? "Victory" : "Defeat"} · {durationMin} min
              </div>
              <div style={{ opacity: 0.8 }}>
                Champ ID {m.championId} · {m.role || m.lane || "N/A"}
              </div>
            </div>
            <div>
              <div>
                {m.kills}/{m.deaths}/{m.assists} · KDA {kda}
              </div>
              <div style={{ opacity: 0.8 }}>
                {m.csPerMin.toFixed(1)} cs/min · {m.goldPerMin.toFixed(0)} gold/min
              </div>
            </div>
            <div style={{ maxWidth: 160, fontSize: 12, opacity: 0.8 }}>
              Items: {m.items.join(", ")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
