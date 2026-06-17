//src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import cookieParser from "cookie-parser";
import path from "path";
import {securityHeadersConfig} from "./config/security-headers.config"
import { userRateLimitMiddleware } from "./middlewares/user-rate-limit.middleware";
import { inputSanitizationMiddleware } from "./middlewares/input-sanitization.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware"

import { corsOptions, limiter } from './config/middleware';
import routes from './routes';

dotenv.config();

const app = express();

// Trust proxy for correct IP detection when running behind a load balancer or reverse proxy
app.set("trust proxy", 1)

// Basic security & body parsing
app.disable("x-powered-by")
app.use(cors(corsOptions));
app.use(
  helmet({

    hsts:
      securityHeadersConfig.hsts,

    contentSecurityPolicy:
      securityHeadersConfig
        .contentSecurityPolicy,

    frameguard: {
      action: "deny"
    },

    noSniff: true,

    referrerPolicy: {
      policy:
        "strict-origin-when-cross-origin"
    }
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }))
app.use(inputSanitizationMiddleware)
app.use(userRateLimitMiddleware)
app.use(limiter)
app.use(cookieParser())
app.use(requestLogger)

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