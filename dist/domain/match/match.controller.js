"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchController = void 0;
const match_service_1 = require("./match.service");
class MatchController {
    static async getMatchesByPuuid(req, res) {
        const { puuid } = req.params;
        const count = Number(req.query.count || 10);
        if (!puuid) {
            return res.status(400).json({ error: 'Missing puuid' });
        }
        try {
            const matches = await match_service_1.MatchService.getRecentMatches(puuid, count);
            return res.json(matches);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch matches' });
        }
    }
    static async getMatchById(req, res) {
        const { matchId } = req.params;
        const { puuid } = req.query;
        if (!matchId || !puuid || typeof puuid !== 'string') {
            return res.status(400).json({ error: 'Missing matchId or puuid' });
        }
        try {
            const summary = await match_service_1.MatchService.getMatchSummary(matchId, puuid);
            return res.json(summary);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch match' });
        }
    }
}
exports.MatchController = MatchController;
