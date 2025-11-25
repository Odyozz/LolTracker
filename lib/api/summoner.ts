import { api } from './client';

export interface SummonerProfile {
  name: string;
  level: number;
  profileIconId: number;
  puuid: string;
  summonerId: string;
  ranks: {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }[];
}

export interface MatchSummary {
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
}

export async function fetchSummoner(name: string) {
  const res = await api.get<SummonerProfile>(
    `/summoner/${encodeURIComponent(name)}`
  );
  return res.data;
}

export async function fetchMatches(puuid: string, count = 10) {
  const res = await api.get<MatchSummary[]>(`/matches/${puuid}`, {
    params: { count },
  });
  return res.data;
}
