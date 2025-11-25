import { Request, Response } from 'express';
import { StaticService } from './static.service';

export class StaticController {
  static async getChampions(_req: Request, res: Response) {
    try {
      const champions = await StaticService.getChampions();
      res.json(champions);
    } catch (err) {
      console.error('Error fetching champions:', err);
      res.status(500).json({ error: 'Failed to fetch champions' });
    }
  }

  static async getItems(_req: Request, res: Response) {
    try {
      const items = await StaticService.getItems();
      res.json(items);
    } catch (err) {
      console.error('Error fetching items:', err);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  static async getRunes(_req: Request, res: Response) {
    try {
      const runes = await StaticService.getRunes();
      res.json(runes);
    } catch (err) {
      console.error('Error fetching runes:', err);
      res.status(500).json({ error: 'Failed to fetch runes' });
    }
  }
}
