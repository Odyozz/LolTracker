import { Router } from 'express';
import { SummonerController } from '../domain/summoner/summoner.controller';
import { MatchController } from '../domain/match/match.controller';
import { StaticController } from '../domain/static/static.controller';

const router = Router();

// Summoner
router.get('/summoner/:name', SummonerController.getSummoner);

// Matches
router.get('/matches/:puuid', MatchController.getMatchesByPuuid);
router.get('/match/:matchId', MatchController.getMatchById);

// Data Dragon
router.get('/champions', StaticController.getChampions);
router.get('/items', StaticController.getItems);
router.get('/runes', StaticController.getRunes);

export default router;
