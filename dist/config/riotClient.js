"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.riotMatchApi = exports.riotAccountApi = exports.riotSummonerApi = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("./env");
// On prépare les params communs, comme dans la doc Riot (?api_key=...)
const baseParams = {
    api_key: env_1.config.riotApiKey,
};
// Summoner-v4, League-v4 ⇒ platform routing (euw1, na1, etc.)
exports.riotSummonerApi = axios_1.default.create({
    baseURL: `https://${env_1.config.riotRegion.toLowerCase()}.api.riotgames.com`,
    // On garde aussi le header, au cas où
    headers: {
        'X-Riot-Token': env_1.config.riotApiKey,
    },
    params: baseParams,
});
// Account-v1 & Match-v5 ⇒ regional routing (europe, americas, asia, sea)
exports.riotAccountApi = axios_1.default.create({
    baseURL: `https://${env_1.config.riotPlatform.toLowerCase()}.api.riotgames.com`,
    headers: {
        'X-Riot-Token': env_1.config.riotApiKey,
    },
    params: baseParams,
});
// On peut réutiliser le même client pour Match-v5
exports.riotMatchApi = exports.riotAccountApi;
console.log('[Riot] Summoner API:', exports.riotSummonerApi.defaults.baseURL);
console.log('[Riot] Account/Match API:', exports.riotAccountApi.defaults.baseURL);
console.log('[Riot] Using API key prefix:', env_1.config.riotApiKey ? env_1.config.riotApiKey.slice(0, 12) : 'NONE');
