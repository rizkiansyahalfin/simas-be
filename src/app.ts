//src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import path from "path";

import { corsOptions, limiter } from './config/middleware';
import routes from './routes';

dotenv.config();

const app = express();

// Basic security & JSON parser
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(limiter);
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
)


// Custom Middleware: X-Request-ID
app.use((req, res, next) => {
  const id = uuidv4();
  req.headers["x-request-id"] = id;
  res.setHeader("X-Request-ID", id);
  next();
});

// Response Time Middleware
app.use((_req, res, next) => {//'req' is declared but its value is never read.
  const start = Date.now();
  const original = res.json.bind(res);

  res.json = (body: unknown) => {
    const duration = Date.now() - start;
    res.setHeader("X-Response-Time", `${duration}ms`);
    return original(body);
  };

  next();
});

app.use("/api", routes);

export default app;