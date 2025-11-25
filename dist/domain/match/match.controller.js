"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchController = void 0;
const match_service_1 = require("./match.service");
class MatchController {
    // 🔹 Historique des X dernières games d'un joueur
    static async getMatchesByPuuid(req, res) {
        var _a, _b, _c, _d;
        try {
            const puuid = req.params.puuid;
            const count = Number((_a = req.query.count) !== null && _a !== void 0 ? _a : 10);
            const matches = await match_service_1.MatchService.getRecentMatches(puuid, count);
            res.json(matches);
        }
        catch (err) {
            console.error('[MATCH_FETCH_ERROR]', (_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status, ((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.data) || err);
            res.status(500).json({
                error: 'Failed to fetch matches',
                details: ((_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.data) ||
                    (err instanceof Error ? err.message : String(err)),
            });
        }
    }
    // 🔹 Détail brut d'une game
    static async getMatchById(req, res) {
        var _a, _b, _c;
        try {
            const matchId = req.params.matchId;
            const match = await match_service_1.MatchService.getMatch(matchId);
            res.json(match);
        }
        catch (err) {
            console.error('[MATCH_DETAIL_ERROR]', (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status, ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || err);
            res.status(500).json({
                error: 'Failed to fetch match detail',
                details: ((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.data) ||
                    (err instanceof Error ? err.message : String(err)),
            });
        }
    }
    // 🔹 Analyse globale du joueur
    static async getPlayerAnalysis(req, res) {
        var _a, _b, _c, _d;
        try {
            const puuid = req.params.puuid;
            const count = Number((_a = req.query.count) !== null && _a !== void 0 ? _a : 20);
            const analysis = await match_service_1.MatchService.getPlayerAnalysis(puuid, count);
            res.json(analysis);
        }
        catch (err) {
            console.error('[PLAYER_ANALYSIS_ERROR]', (_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status, ((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.data) || err);
            res.status(500).json({
                error: 'Failed to build player analysis',
                details: ((_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.data) ||
                    (err instanceof Error ? err.message : String(err)),
            });
        }
    }
}
exports.MatchController = MatchController;
