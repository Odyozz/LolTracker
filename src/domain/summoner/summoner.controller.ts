import { Request, Response } from 'express';
import { SummonerService } from './summoner.service';

export class SummonerController {
  static async getSummoner(req: Request, res: Response) {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: 'Missing summoner name' });
    }

    try {
      const profile = await SummonerService.getSummonerByName(name);
      return res.json(profile);
    } catch (err: any) {
      if (err.message === 'SUMMONER_NOT_FOUND') {
        return res.status(404).json({ error: 'Summoner not found' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch summoner' });
    }
  }
}
