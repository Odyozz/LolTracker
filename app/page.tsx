'use client';

import React, { useState } from 'react';
import { SummonerSearchBar } from '../components/SummonerSearchBar';

type SummonerProfile = {
  name: string;
  level: number;
  profileIconId?: number;
  puuid: string;
  summonerId: string;
  ranks?: any[];
};

export default function HomePage() {
  const [summoner, setSummoner] = useState<SummonerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (riotId: string) => {
    setError(null);
    setSummoner(null);
    setLoading(true);

    try {
      console.log('[UI] Searching summoner:', riotId);

      const res = await fetch(`/api/summoner/${encodeURIComponent(riotId)}`, {
        method: 'GET',
      });

      const raw = await res.text(); // 🔥 on lit en texte d'abord
      console.log('[UI] Raw backend response:', raw.slice(0, 200));

      if (!res.ok) {
        throw new Error(
          `Erreur serveur (${res.status}) : ${raw.slice(0, 200)}`
        );
      }

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch (e) {
        throw new Error(
          `Réponse non JSON du backend (${res.status}) : ${raw.slice(0, 200)}`
        );
      }

      console.log('[UI] Parsed JSON:', data);
      setSummoner(data);
    } catch (e: any) {
      console.error('[UI] Error in handleSearch:', e);
      setError(e.message || 'Impossible de récupérer le joueur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: '#f9fafb',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <header>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>League Companion</h1>
          <SummonerSearchBar onSearch={handleSearch} />
        </header>

        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {summoner && (
          <section
            style={{
              background: '#020617',
              borderRadius: 16,
              border: '1px solid #1f2937',
              padding: 16,
            }}
          >
            <h2>{summoner.name}</h2>
            <p>Niveau {summoner.level}</p>
            <p>PUUID : {summoner.puuid}</p>
            <p>Summoner ID : {summoner.summonerId}</p>
          </section>
        )}
      </div>
    </main>
  );
}
