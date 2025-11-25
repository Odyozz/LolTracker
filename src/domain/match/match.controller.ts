import { Request, Response } from 'express';
import { MatchService } from './match.service';

export class MatchController {
  // 🔹 Historique des X dernières games d'un joueur
  static async getMatchesByPuuid(req: Request, res: Response) {
    try {
      const puuid = req.params.puuid;
      const count = Number(req.query.count ?? 10);

      const matches = await MatchService.getRecentMatches(puuid, count);
      res.json(matches);
    } catch (err: any) {
      console.error(
        '[MATCH_FETCH_ERROR]',
        err?.response?.status,
        err?.response?.data || err
      );

      res.status(500).json({
        error: 'Failed to fetch matches',
        details:
          err?.response?.data ||
          (err instanceof Error ? err.message : String(err)),
      });
    }
  }

  // 🔹 Détail brut d'une game
  static async getMatchById(req: Request, res: Response) {
    try {
      const matchId = req.params.matchId;
      const match = await MatchService.getMatch(matchId);
      res.json(match);
    } catch (err: any) {
      console.error(
        '[MATCH_DETAIL_ERROR]',
        err?.response?.status,
        err?.response?.data || err
      );

      res.status(500).json({
        error: 'Failed to fetch match detail',
        details:
          err?.response?.data ||
          (err instanceof Error ? err.message : String(err)),
      });
    }
  }

  // 🔹 Analyse globale du joueur
  static async getPlayerAnalysis(req: Request, res: Response) {
    try {
      const puuid = req.params.puuid;
      const count = Number(req.query.count ?? 20);

      const analysis = await MatchService.getPlayerAnalysis(puuid, count);
      res.json(analysis);
    } catch (err: any) {
      console.error(
        '[PLAYER_ANALYSIS_ERROR]',
        err?.response?.status,
        err?.response?.data || err
      );

      res.status(500).json({
        error: 'Failed to build player analysis',
        details:
          err?.response?.data ||
          (err instanceof Error ? err.message : String(err)),
      });
    }
  }
}
