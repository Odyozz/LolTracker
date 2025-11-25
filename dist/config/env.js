"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    riotApiKey: process.env.RIOT_API_KEY || "",
    platform: process.env.RIOT_PLATFORM || "euw1", // ex: euw1
    region: process.env.RIOT_REGION || "europe", // ex: europe
    port: process.env.PORT || 4000,
    // 🔥 nouveau champ pour Data Dragon
    dataDragonLang: process.env.DDRAGON_LANG || "fr_FR",
};
