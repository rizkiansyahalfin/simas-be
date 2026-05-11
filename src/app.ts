import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { corsOptions, limiter } from './config/middleware';
import routes from './routes';
import donationRouter from "./modules/donations/donation.route";

dotenv.config();

const app: Application = express();

// ✅ MIDDLEWARE GLOBAL (URUTAN BEST PRACTICE)
app.use(helmet()); // security headers
app.use(cors(corsOptions)); // CORS config
app.use(morgan('dev')); // logging
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // form data
app.use(limiter); // rate limiting

// ✅ ROUTES
app.use('/api', routes);

// ✅ 404 HANDLER
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route tidak ditemukan',
  });
});

// ✅ GLOBAL ERROR HANDLER
interface CustomError extends Error {
  status?: number;
}

app.use(
  (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  }
);

app.use("/api/donations", donationRouter);

export default app;