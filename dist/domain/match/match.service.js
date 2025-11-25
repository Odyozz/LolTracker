"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const riotClient_1 = require("../../config/riotClient");
class MatchService {
    static async getMatchIdsByPuuid(puuid, count = 10) {
        const res = await riotClient_1.riotMatchApi.get(`/lol/match/v5/matches/by-puuid/${puuid}/ids`, { params: { start: 0, count } });
        return res.data;
    }
    // 🔹 Détail brut d'une game (pour la page match detail plus tard)
    static async getMatch(matchId) {
        const res = await riotClient_1.riotMatchApi.get(`/lol/match/v5/matches/${matchId}`);
        return res.data;
    }
    static async getMatchSummary(matchId, puuid) {
        const res = await riotClient_1.riotMatchApi.get(`/lol/match/v5/matches/${matchId}`);
        const matchData = res.data;
        const info = matchData.info;
        const gameDuration = info.gameDuration; // en secondes
        const participant = info.participants.find((p) => p.puuid === puuid);
        if (!participant) {
            throw new Error('PARTICIPANT_NOT_FOUND');
        }
        const { championId, role, lane, kills, deaths, assists, win, totalMinionsKilled, neutralMinionsKilled, goldEarned, totalDamageDealtToChampions, totalDamageTaken, visionScore, item0, item1, item2, item3, item4, item5, item6, } = participant;
        const totalCs = totalMinionsKilled + neutralMinionsKilled;
        const durationMinutes = gameDuration / 60;
        const csPerMin = durationMinutes > 0 ? totalCs / durationMinutes : 0;
        const goldPerMin = durationMinutes > 0 ? goldEarned / durationMinutes : 0;
        const items = [item0, item1, item2, item3, item4, item5, item6].filter((id) => typeof id === 'number' && id > 0);
        const summary = {
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
    static async getRecentMatches(puuid, count = 10) {
        const ids = await this.getMatchIdsByPuuid(puuid, count);
        const summaries = [];
        for (const id of ids) {
            try {
                const summary = await this.getMatchSummary(id, puuid);
                summaries.push(summary);
            }
            catch (err) {
                console.error('Error on match', id, err);
            }
        }
        return summaries;
    }
    // 🔹 Construit l’analyse à partir d’une liste de matchs
    static buildPlayerAnalysis(puuid, matches) {
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
        const sumDmg = matches.reduce((acc, m) => { var _a; return acc + ((_a = m.damageDealt) !== null && _a !== void 0 ? _a : 0); }, 0);
        const sumDmgTaken = matches.reduce((acc, m) => { var _a; return acc + ((_a = m.damageTaken) !== null && _a !== void 0 ? _a : 0); }, 0);
        const sumVision = matches.reduce((acc, m) => { var _a; return acc + ((_a = m.visionScore) !== null && _a !== void 0 ? _a : 0); }, 0);
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
    static async getPlayerAnalysis(puuid, count = 20) {
        const matches = await this.getRecentMatches(puuid, count);
        return this.buildPlayerAnalysis(puuid, matches);
    }
}
exports.MatchService = MatchService;
