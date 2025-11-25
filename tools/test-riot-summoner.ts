import "dotenv/config";
import axios from "axios";

async function main() {
  const apiKey = process.env.RIOT_API_KEY;
  const puuid = process.env.TEST_PUUID;

  if (!apiKey) {
    console.error("RIOT_API_KEY manquante dans .env");
    process.exit(1);
  }

  if (!puuid) {
    console.error("TEST_PUUID manquant dans .env");
    process.exit(1);
  }

  try {
    const res = await axios.get(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
        puuid
      )}`,
      {
        headers: {
          "X-Riot-Token": apiKey,
        },
      }
    );

    console.log("Status:", res.status);
    console.log("Data:", res.data);
  } catch (err: any) {
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

main();
