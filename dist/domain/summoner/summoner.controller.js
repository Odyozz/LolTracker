"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummonerController = void 0;
const summoner_service_1 = require("./summoner.service");
class SummonerController {
    static async getSummoner(req, res) {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ error: 'Missing summoner name' });
        }
        try {
            const profile = await summoner_service_1.SummonerService.getSummonerByName(name);
            return res.json(profile);
        }
        catch (err) {
            if (err.message === 'SUMMONER_NOT_FOUND') {
                return res.status(404).json({ error: 'Summoner not found' });
            }
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch summoner' });
        }
    }
}
exports.SummonerController = SummonerController;
