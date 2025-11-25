"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticController = void 0;
const static_service_1 = require("./static.service");
class StaticController {
    static async getChampions(_req, res) {
        try {
            const champions = await static_service_1.StaticService.getChampions();
            res.json(champions);
        }
        catch (err) {
            console.error('Error fetching champions:', err);
            res.status(500).json({ error: 'Failed to fetch champions' });
        }
    }
    static async getItems(_req, res) {
        try {
            const items = await static_service_1.StaticService.getItems();
            res.json(items);
        }
        catch (err) {
            console.error('Error fetching items:', err);
            res.status(500).json({ error: 'Failed to fetch items' });
        }
    }
    static async getRunes(_req, res) {
        try {
            const runes = await static_service_1.StaticService.getRunes();
            res.json(runes);
        }
        catch (err) {
            console.error('Error fetching runes:', err);
            res.status(500).json({ error: 'Failed to fetch runes' });
        }
    }
}
exports.StaticController = StaticController;
