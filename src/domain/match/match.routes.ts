import { Express, Request, Response } from 'express';
import { MatchService } from './match.service';

export function registerMatchRoutes(app: Express) {
  // 🔹 Historique des X dernières games d'un joueur
  app.get('/api/matches/:puuid', async (req: Request, res: Response) => {
    try {
      const puuid = req.params.puuid;
      const count = Number(req.query.count ?? 10);

      const matches = await MatchService.getRecentMatches(puuid, count);
      res.json(matches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'MATCH_FETCH_ERROR' });
    }
  });

  // 🔹 Détail brut d'une game (servira pour la page match detail)
  app.get('/api/match/:matchId', async (req: Request, res: Response) => {
    try {
      const match = await MatchService.getMatch(req.params.matchId);
      res.json(match);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'MATCH_DETAIL_ERROR' });
    }
  });
}
