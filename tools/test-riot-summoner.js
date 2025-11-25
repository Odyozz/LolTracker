import "dotenv/config";
import axios from "axios";

async function main() {
  const apiKey = process.env.RIOT_API_KEY;
  const puuid = process.env.TEST_PUUID;

  if (!apiKey) {
    console.error("❌ RIOT_API_KEY manquante dans .env");
    process.exit(1);
  }

  if (!puuid) {
    console.error("❌ TEST_PUUID manquant dans .env");
    process.exit(1);
  }

  const url = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
    puuid
  )}`;

  console.log("👉 Test Summoner-v4 :");
  console.log("URL :", url);

  try {
    const res = await axios.get(url, {
      headers: {
        "X-Riot-Token": apiKey,
      },
    });

    console.log("✅ Status:", res.status);
    console.log("Data:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("❌ Status:", err.response.status);
      console.log("Response:", err.response.data);
    } else {
      console.log("❌ Error:", err.message);
    }
  }
}

main();
