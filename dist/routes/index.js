"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const summoner_controller_1 = require("../domain/summoner/summoner.controller");
const match_controller_1 = require("../domain/match/match.controller");
const static_controller_1 = require("../domain/static/static.controller");
const router = (0, express_1.Router)();
// Summoner
router.get('/summoner/:name', summoner_controller_1.SummonerController.getSummoner);
// Matches
router.get('/matches/:puuid', match_controller_1.MatchController.getMatchesByPuuid);
router.get('/match/:matchId', match_controller_1.MatchController.getMatchById);
// Analyse globale joueur
router.get('/analysis/:puuid', match_controller_1.MatchController.getPlayerAnalysis);
// Data Dragon
router.get('/champions', static_controller_1.StaticController.getChampions);
router.get('/items', static_controller_1.StaticController.getItems);
router.get('/runes', static_controller_1.StaticController.getRunes);
exports.default = router;
