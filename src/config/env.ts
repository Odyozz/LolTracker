import dotenv from 'dotenv';
dotenv.config();

export const config = {
  riotApiKey: process.env.RIOT_API_KEY || '',
  riotRegion: process.env.RIOT_REGION || 'EUW1',
  riotPlatform: process.env.RIOT_PLATFORM || 'europe',
  port: Number(process.env.PORT) || 4000,
  dataDragonLang: process.env.DDRAGON_LANG || 'en_US',
};

console.log('RIOT_API_KEY loaded (prefix):', config.riotApiKey.slice(0, 10));
console.log('RIOT_REGION:', config.riotRegion);
console.log('RIOT_PLATFORM:', config.riotPlatform);

if (!config.riotApiKey) {
  console.warn('⚠️ RIOT_API_KEY is not set in .env');
}
