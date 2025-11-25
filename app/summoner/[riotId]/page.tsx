import MatchHistory from "@/components/MatchHistory";

async function getSummonerProfile(riotId: string) {
  const res = await fetch(
    `${process.env.BACKEND_URL}/api/summoner/${encodeURIComponent(riotId)}`,
    {
      // tu peux ajuster le cache plus tard (revalidate, no-store, etc.)
      next: { revalidate: 30 },
    }
  );

  if (!res.ok) {
    console.error("Summoner fetch error", res.status);
    return null;
  }

  return res.json();
}

export default async function SummonerPage({
  params,
}: {
  params: { riotId: string };
}) {
  const profile = await getSummonerProfile(params.riotId);

  if (!profile) {
    return <div>Player not found.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Profil */}
      <h1>{profile.name}</h1>
      <p>Level {profile.level}</p>

      {/* Historique */}
      <h2 style={{ marginTop: 24 }}>Match History</h2>
      <MatchHistory puuid={profile.puuid} />
    </div>
  );
}
