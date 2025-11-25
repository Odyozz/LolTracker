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
}
exports.MatchService = MatchService;
