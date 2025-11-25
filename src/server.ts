import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck pour Render
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRouter);

// Middleware d'erreur global
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const port =
  Number(process.env.PORT) ||
  Number(config.port) ||
  4000;

app.listen(port, () => {
  console.log(`🚀 Backend listening on http://localhost:${port}`);
});
