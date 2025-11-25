import { riotMatchApi } from '../../config/riotClient';

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

export class MatchService {
  static async getMatchIdsByPuuid(
    puuid: string,
    count = 10
  ): Promise<string[]> {
    const res = await riotMatchApi.get(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      { params: { start: 0, count } }
    );
    return res.data as string[];
  }

  static async getMatchSummary(
    matchId: string,
    puuid: string
  ): Promise<MatchSummary> {
    const res = await riotMatchApi.get(`/lol/match/v5/matches/${matchId}`);
    const matchData = res.data;

    const info = matchData.info;
    const gameDuration = info.gameDuration; // en secondes

    const participant = info.participants.find((p: any) => p.puuid === puuid);

    if (!participant) {
      throw new Error('PARTICIPANT_NOT_FOUND');
    }

    const {
      championId,
      role,
      lane,
      kills,
      deaths,
      assists,
      win,
      totalMinionsKilled,
      neutralMinionsKilled,
      goldEarned,
      item0,
      item1,
      item2,
      item3,
      item4,
      item5,
      item6,
    } = participant;

    const totalCs = totalMinionsKilled + neutralMinionsKilled;
    const durationMinutes = gameDuration / 60;
    const csPerMin = durationMinutes > 0 ? totalCs / durationMinutes : 0;
    const goldPerMin = durationMinutes > 0 ? goldEarned / durationMinutes : 0;

    const summary: MatchSummary = {
      matchId,
      championId,
      role,
      lane,
      kills,
      deaths,
      assists,
      win,
      gameDuration,
      csPerMin,
      goldPerMin,
      items: [item0, item1, item2, item3, item4, item5, item6],
    };

    return summary;
  }

  static async getRecentMatches(
    puuid: string,
    count = 10
  ): Promise<MatchSummary[]> {
    const ids = await this.getMatchIdsByPuuid(puuid, count);
    const summaries: MatchSummary[] = [];

    for (const id of ids) {
      try {
        const summary = await this.getMatchSummary(id, puuid);
        summaries.push(summary);
      } catch (err) {
        console.error('Error on match', id, err);
      }
    }

    return summaries;
  }
}
