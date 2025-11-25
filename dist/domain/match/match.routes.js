"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMatchRoutes = registerMatchRoutes;
const match_service_1 = require("./match.service");
function registerMatchRoutes(app) {
    // 🔹 Historique des X dernières games d'un joueur
    app.get('/api/matches/:puuid', async (req, res) => {
        var _a;
        try {
            const puuid = req.params.puuid;
            const count = Number((_a = req.query.count) !== null && _a !== void 0 ? _a : 10);
            const matches = await match_service_1.MatchService.getRecentMatches(puuid, count);
            res.json(matches);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'MATCH_FETCH_ERROR' });
        }
    });
    // 🔹 Détail brut d'une game (servira pour la page match detail)
    app.get('/api/match/:matchId', async (req, res) => {
        try {
            const match = await match_service_1.MatchService.getMatch(req.params.matchId);
            res.json(match);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'MATCH_DETAIL_ERROR' });
        }
    });
    // 🔹 Analyse globale du joueur sur X games (style DPM.lol)
    app.get('/api/analysis/:puuid', async (req, res) => {
        var _a;
        try {
            const puuid = req.params.puuid;
            const count = Number((_a = req.query.count) !== null && _a !== void 0 ? _a : 20);
            const analysis = await match_service_1.MatchService.getPlayerAnalysis(puuid, count);
            res.json(analysis);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: 'PLAYER_ANALYSIS_ERROR' });
        }
    });
}
