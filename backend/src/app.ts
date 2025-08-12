import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { router as apiRouter } from './routes/index.js';

const app = express();

// Tweak helmet for dev to avoid over-restrictive cross-origin resource policy
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const defaultOrigin = 'http://localhost:3000';
const allowedOrigins = new Set([
  process.env.CORS_ORIGIN || defaultOrigin,
  defaultOrigin,
  'http://127.0.0.1:3000',
]);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow non-browser clients
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: false,
    optionsSuccessStatus: 200,
  })
);
// Enable preflight across the board
app.options('*', cors());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1', apiRouter);

export default app;

