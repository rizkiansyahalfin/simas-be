//src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
const app = express();
// Basic security & JSON parser
app.use(cors());
app.use(helmet());
app.use(express.json());
// Custom Middleware: X-Request-ID
app.use((req, res, next) => {
    const id = uuidv4();
    req.headers["x-request-id"] = id;
    res.setHeader("X-Request-ID", id);
    next();
});
// Response Time Middleware
app.use((_req, res, next) => {
    const start = Date.now();
    const original = res.json.bind(res);
    res.json = (body) => {
        const duration = Date.now() - start;
        res.setHeader("X-Response-Time", `${duration}ms`);
        return original(body);
    };
    next();
});
export default app;
