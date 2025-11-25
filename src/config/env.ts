import dotenv from "dotenv";

dotenv.config();

export const config = {
  riotApiKey: process.env.RIOT_API_KEY || "",
  platform: process.env.RIOT_PLATFORM || "euw1",   // shard "platform"
  region: process.env.RIOT_REGION || "europe",     // shard "region" pour Match-v5
  port: process.env.PORT || 4000,
};
