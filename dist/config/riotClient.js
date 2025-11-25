"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.riotMatchApi = exports.riotSummonerApi = exports.riotAccountApi = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("./env");
// Account-v1 (par Riot ID)
exports.riotAccountApi = axios_1.default.create({
    baseURL: `https://${env_1.config.platform}.api.riotgames.com`,
    headers: {
        "X-Riot-Token": env_1.config.riotApiKey,
    },
});
exports.riotSummonerApi = axios_1.default.create({
    baseURL: `https://${env_1.config.platform}.api.riotgames.com`,
    headers: {
        "X-Riot-Token": env_1.config.riotApiKey,
    },
});
// Match-v5 → REGION shard (europe)
exports.riotMatchApi = axios_1.default.create({
    baseURL: `https://${env_1.config.region}.api.riotgames.com`,
    headers: {
        "X-Riot-Token": env_1.config.riotApiKey,
    },
});
