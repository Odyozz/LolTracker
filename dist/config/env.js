"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    riotApiKey: process.env.RIOT_API_KEY || '',
    riotRegion: process.env.RIOT_REGION || 'EUW1',
    riotPlatform: process.env.RIOT_PLATFORM || 'europe',
    port: Number(process.env.PORT) || 4000,
    dataDragonLang: process.env.DDRAGON_LANG || 'en_US',
};
console.log('RIOT_API_KEY loaded (prefix):', exports.config.riotApiKey.slice(0, 10));
console.log('RIOT_REGION:', exports.config.riotRegion);
console.log('RIOT_PLATFORM:', exports.config.riotPlatform);
if (!exports.config.riotApiKey) {
    console.warn('⚠️ RIOT_API_KEY is not set in .env');
}
