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

  // champs bonus déjà calculés (optionnels)
  totalCs?: number;
  goldEarned?: number;
  damageDealt?: number;
  damageTaken?: number;
  visionScore?: number;
}

export interface PlayerAnalysis {
  puuid: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number; // 0–100 en %
  avgKills: number;
  avgDeaths: number;
  avgAssists: number;
  avgKda: number;
  avgCsPerMin: number;
  avgGoldPerMin: number;
  avgDamageDealt: number;
  avgDamageTaken: number;
  avgVisionScore: number;
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

  // 🔹 Détail brut d'une game (pour la page match detail plus tard)
  static async getMatch(matchId: string): Promise<any> {
    const res = await riotMatchApi.get(`/lol/match/v5/matches/${matchId}`);
    return res.data;
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
      totalDamageDealtToChampions,
      totalDamageTaken,
      visionScore,
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

    const items = [item0, item1, item2, item3, item4, item5, item6].filter(
      (id: number) => typeof id === 'number' && id > 0
    );

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
      items,
      totalCs,
      goldEarned,
      damageDealt: totalDamageDealtToChampions,
      damageTaken: totalDamageTaken,
      visionScore,
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

  // 🔹 Construit l’analyse à partir d’une liste de matchs
  static buildPlayerAnalysis(
    puuid: string,
    matches: MatchSummary[]
  ): PlayerAnalysis {
    const totalGames = matches.length;

    if (totalGames === 0) {
      return {
        puuid,
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        avgKills: 0,
        avgDeaths: 0,
        avgAssists: 0,
        avgKda: 0,
        avgCsPerMin: 0,
        avgGoldPerMin: 0,
        avgDamageDealt: 0,
        avgDamageTaken: 0,
        avgVisionScore: 0,
      };
    }

    const wins = matches.filter((m) => m.win).length;
    const losses = totalGames - wins;

    const sumKills = matches.reduce((acc, m) => acc + m.kills, 0);
    const sumDeaths = matches.reduce((acc, m) => acc + m.deaths, 0);
    const sumAssists = matches.reduce((acc, m) => acc + m.assists, 0);
    const sumCsPerMin = matches.reduce((acc, m) => acc + m.csPerMin, 0);
    const sumGoldPerMin = matches.reduce((acc, m) => acc + m.goldPerMin, 0);
    const sumDmg = matches.reduce(
      (acc, m) => acc + (m.damageDealt ?? 0),
      0
    );
    const sumDmgTaken = matches.reduce(
      (acc, m) => acc + (m.damageTaken ?? 0),
      0
    );
    const sumVision = matches.reduce(
      (acc, m) => acc + (m.visionScore ?? 0),
      0
    );

    const avgKills = sumKills / totalGames;
    const avgDeaths = sumDeaths / totalGames;
    const avgAssists = sumAssists / totalGames;
    const avgCsPerMin = sumCsPerMin / totalGames;
    const avgGoldPerMin = sumGoldPerMin / totalGames;
    const avgDamageDealt = sumDmg / totalGames;
    const avgDamageTaken = sumDmgTaken / totalGames;
    const avgVisionScore = sumVision / totalGames;

    const totalKp = sumKills + sumAssists;
    const avgKda = sumDeaths === 0 ? totalKp : totalKp / sumDeaths;

    return {
      puuid,
      totalGames,
      wins,
      losses,
      winRate: (wins / totalGames) * 100,
      avgKills,
      avgDeaths,
      avgAssists,
      avgKda,
      avgCsPerMin,
      avgGoldPerMin,
      avgDamageDealt,
      avgDamageTaken,
      avgVisionScore,
    };
  }

  // 🔹 Analyse globale d’un joueur sur X dernières games
  static async getPlayerAnalysis(
    puuid: string,
    count = 20
  ): Promise<PlayerAnalysis> {
    const matches = await this.getRecentMatches(puuid, count);
    return this.buildPlayerAnalysis(puuid, matches);
  }
}
