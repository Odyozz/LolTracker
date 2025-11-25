export interface SummonerProfile {
  name: string;
  level: number;
  profileIconId: number;
  puuid: string;
  summonerId: string;
  ranks: Array<{
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }>;
}
