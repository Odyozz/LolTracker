import axios from 'axios';
import { config } from './env';

// On prépare les params communs, comme dans la doc Riot (?api_key=...)
const baseParams = {
  api_key: config.riotApiKey,
};

// Summoner-v4, League-v4 ⇒ platform routing (euw1, na1, etc.)
export const riotSummonerApi = axios.create({
  baseURL: `https://${config.riotRegion.toLowerCase()}.api.riotgames.com`,
  // On garde aussi le header, au cas où
  headers: {
    'X-Riot-Token': config.riotApiKey,
  },
  params: baseParams,
});

// Account-v1 & Match-v5 ⇒ regional routing (europe, americas, asia, sea)
export const riotAccountApi = axios.create({
  baseURL: `https://${config.riotPlatform.toLowerCase()}.api.riotgames.com`,
  headers: {
    'X-Riot-Token': config.riotApiKey,
  },
  params: baseParams,
});

// On peut réutiliser le même client pour Match-v5
export const riotMatchApi = riotAccountApi;

console.log('[Riot] Summoner API:', riotSummonerApi.defaults.baseURL);
console.log('[Riot] Account/Match API:', riotAccountApi.defaults.baseURL);
console.log(
  '[Riot] Using API key prefix:',
  config.riotApiKey ? config.riotApiKey.slice(0, 12) : 'NONE'
);
