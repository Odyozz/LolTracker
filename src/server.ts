import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck pour Render
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRouter);

// Middleware d'erreur global typé
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
);

// Render fournit PORT, sinon on tombe sur config.port, sinon 4000
const port =
  Number(process.env.PORT) ||
  Number(config.port) ||
  4000;

app.listen(port, () => {
  console.log(`🚀 Backend listening on http://localhost:${port}`);
});
