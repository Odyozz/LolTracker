"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com';
const championsCache = {
    version: null,
    data: null,
    lastFetch: null,
};
const itemsCache = {
    version: null,
    data: null,
    lastFetch: null,
};
const runesCache = {
    version: null,
    data: null,
    lastFetch: null,
};
const CACHE_TTL_MS = 1000 * 60 * 60; // 1h
async function getLatestVersion() {
    const res = await axios_1.default.get(`${DDRAGON_BASE}/api/versions.json`);
    // Version la plus récente en premier
    return res.data[0];
}
function isCacheValid(cache) {
    if (!cache.lastFetch)
        return false;
    return Date.now() - cache.lastFetch < CACHE_TTL_MS;
}
class StaticService {
    static async getChampions() {
        if (championsCache.data && isCacheValid(championsCache)) {
            return championsCache.data;
        }
        const version = await getLatestVersion();
        const res = await axios_1.default.get(`${DDRAGON_BASE}/cdn/${version}/data/${env_1.config.dataDragonLang}/champion.json`);
        const raw = res.data.data;
        const champions = Object.values(raw).map((c) => ({
            id: c.id,
            key: Number(c.key),
            name: c.name,
            title: c.title,
            tags: c.tags,
            icon: `${DDRAGON_BASE}/cdn/${version}/img/champion/${c.image.full}`,
        }));
        championsCache.version = version;
        championsCache.data = champions;
        championsCache.lastFetch = Date.now();
        return champions;
    }
    static async getItems() {
        if (itemsCache.data && isCacheValid(itemsCache)) {
            return itemsCache.data;
        }
        const version = await getLatestVersion();
        const res = await axios_1.default.get(`${DDRAGON_BASE}/cdn/${version}/data/${env_1.config.dataDragonLang}/item.json`);
        const raw = res.data.data;
        const items = Object.entries(raw).map(([id, item]) => ({
            id: Number(id),
            name: item.name,
            description: item.description,
            plaintext: item.plaintext,
            totalGold: item.gold.total,
            baseGold: item.gold.base,
            sellGold: item.gold.sell,
            tags: item.tags || [],
            icon: `${DDRAGON_BASE}/cdn/${version}/img/item/${item.image.full}`,
        }));
        itemsCache.version = version;
        itemsCache.data = items;
        itemsCache.lastFetch = Date.now();
        return items;
    }
    static async getRunes() {
        if (runesCache.data && isCacheValid(runesCache)) {
            return runesCache.data;
        }
        const version = await getLatestVersion(); // pas nécessaire pour l’URL, mais pratique si tu veux l’exposer
        const res = await axios_1.default.get(`${DDRAGON_BASE}/cdn/${version}/data/${env_1.config.dataDragonLang}/runesReforged.json`);
        const runes = res.data.map((tree) => ({
            id: tree.id,
            key: tree.key,
            name: tree.name,
            icon: `${DDRAGON_BASE}/cdn/img/${tree.icon}`,
            slots: tree.slots,
        }));
        runesCache.version = version;
        runesCache.data = runes;
        runesCache.lastFetch = Date.now();
        return runes;
    }
}
exports.StaticService = StaticService;
