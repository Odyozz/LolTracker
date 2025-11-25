"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummonerService = void 0;
const riotClient_1 = require("../../config/riotClient");
function parseRiotId(input) {
    const trimmed = input.trim();
    const [rawName, rawTag] = trimmed.split('#');
    const gameName = (rawName || '').trim();
    let tagLine = (rawTag || '').trim();
    if (!tagLine) {
        tagLine = 'EUW';
    }
    return {
        gameName,
        tagLine: tagLine.toUpperCase(),
    };
}
class SummonerService {
    static async getSummonerByName(riotId) {
        let account = null;
        try {
            // 1️⃣ Riot ID -> Account-v1 -> PUUID
            const { gameName, tagLine } = parseRiotId(riotId);
            if (!gameName) {
                throw new Error('INVALID_RIOT_ID');
            }
            console.log('[SummonerService] Resolving Riot ID:', {
                gameName,
                tagLine,
            });
            const accountRes = await riotClient_1.riotAccountApi.get(`/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
            account = accountRes.data;
            // 🔒 Sécurité + aide pour TypeScript : on s'assure que ce n'est pas null
            if (!account) {
                throw new Error('ACCOUNT_NOT_FOUND');
            }
            console.log('[SummonerService] Account found (PUUID):', account.puuid);
            // 2️⃣ PUUID -> Summoner-v4 -> infos invocateur
            const summonerRes = await riotClient_1.riotSummonerApi.get(`/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(account.puuid)}`);
            const summoner = summonerRes.data;
            // 3️⃣ League-v4 pour les ranks
            const leagueRes = await riotClient_1.riotSummonerApi.get(`/lol/league/v4/entries/by-summoner/${summoner.id}`);
            const ranks = leagueRes.data.map((entry) => ({
                queueType: entry.queueType,
                tier: entry.tier,
                rank: entry.rank,
                leaguePoints: entry.leaguePoints,
                wins: entry.wins,
                losses: entry.losses,
            }));
            const profile = {
                name: summoner.name,
                level: summoner.summonerLevel,
                profileIconId: summoner.profileIconId,
                puuid: summoner.puuid,
                summonerId: summoner.id,
                ranks,
            };
            console.log('[SummonerService] Full profile built:', {
                name: profile.name,
                level: profile.level,
            });
            return profile;
        }
        catch (err) {
            const error = err;
            if (error.response) {
                console.error('Error fetching summoner (response):', error.response.status, error.response.data);
                // 🔁 Fallback si Summoner-v4 est interdit (403) mais Account-v1 a fonctionné
                if (error.response.status === 403 && account) {
                    console.warn('⚠️ Summoner-v4 interdit (403). Fallback sur un profil minimal à partir de Account-v1.');
                    const profile = {
                        name: account.gameName,
                        level: 0, // on ne peut pas l’avoir sans Summoner-v4
                        profileIconId: 0,
                        puuid: account.puuid,
                        summonerId: '',
                        ranks: [],
                    };
                    return profile;
                }
                if (error.response.status === 404) {
                    console.error('SUMMONER_NOT_FOUND (Riot ID introuvable)');
                    throw new Error('SUMMONER_NOT_FOUND');
                }
            }
            else {
                console.error('Error fetching summoner (no response):', error.message);
            }
            throw new Error('RIOT_API_ERROR');
        }
    }
}
exports.SummonerService = SummonerService;
