import { Request, Response } from 'express';
import { MatchService } from './match.service';

export class MatchController {
  static async getMatchesByPuuid(req: Request, res: Response) {
    const { puuid } = req.params;
    const count = Number(req.query.count || 10);

    if (!puuid) {
      return res.status(400).json({ error: 'Missing puuid' });
    }

    try {
      const matches = await MatchService.getRecentMatches(puuid, count);
      return res.json(matches);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch matches' });
    }
  }

  static async getMatchById(req: Request, res: Response) {
    const { matchId } = req.params;
    const { puuid } = req.query;

    if (!matchId || !puuid || typeof puuid !== 'string') {
      return res.status(400).json({ error: 'Missing matchId or puuid' });
    }

    try {
      const summary = await MatchService.getMatchSummary(matchId, puuid);
      return res.json(summary);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch match' });
    }
  }
}
