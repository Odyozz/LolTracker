import axios from "axios";
import { config } from "./env";

// Account-v1 (par Riot ID)
export const riotAccountApi = axios.create({
  baseURL: `https://${config.platform}.api.riotgames.com`,
  headers: {
    "X-Riot-Token": config.riotApiKey,
  },
});

// Summoner-v4 / League-v4 → PLATFORM shard (euw1)
export const riotSummonerApi = axios.create({
  baseURL: `https://${config.platform}.api.riotgames.com`,
  headers: {
    "X-Riot-Token": config.riotApiKey,
  },
});

// Match-v5 → REGION shard (europe)
export const riotMatchApi = axios.create({
  baseURL: `https://${config.region}.api.riotgames.com`,
  headers: {
    "X-Riot-Token": config.riotApiKey,
  },
});
