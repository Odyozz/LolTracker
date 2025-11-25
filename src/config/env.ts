import dotenv from "dotenv";

dotenv.config();

export const config = {
  riotApiKey: process.env.RIOT_API_KEY || "",
  platform: process.env.RIOT_PLATFORM || "euw1",   // ex: euw1
  region: process.env.RIOT_REGION || "europe",     // ex: europe
  port: process.env.PORT || 4000,

  // 🔥 nouveau champ pour Data Dragon
  dataDragonLang: process.env.DDRAGON_LANG || "fr_FR",
};
