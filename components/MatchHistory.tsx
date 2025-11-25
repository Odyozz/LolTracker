"use client";

import { useEffect, useState } from "react";

export default function MatchHistory({ puuid }: { puuid: string }) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/matches/${puuid}`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [puuid]);

  if (loading) return <div>Loading matches…</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {matches.map((m) => (
        <div
          key={m.matchId}
          style={{
            border: "1px solid #333",
            padding: 12,
            borderRadius: 8,
            background: m.win ? "#1c2a3a" : "#3a1c1c",
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {m.championId} — {m.win ? "Victory" : "Defeat"}
          </div>
          <div>
            {m.kills}/{m.deaths}/{m.assists} — {m.csPerMin.toFixed(1)} cs/min —{" "}
            {m.goldPerMin.toFixed(0)} gold/min
          </div>
          <div style={{ opacity: 0.7, fontSize: "0.9em" }}>
            Lane: {m.role} / {m.lane}
          </div>
        </div>
      ))}
    </div>
  );
}
