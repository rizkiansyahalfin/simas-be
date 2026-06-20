import app from './app';
import { logger } from './config/logger';

const PORT = process.env.PORT || 3000;

process.on(
  "uncaughtException",
  (error) => {

    logger.error(
      "Uncaught Exception",
      {
        message:
          error.message,

        stack:
          error.stack
      }
    )

    process.exit(1)
  }
)

process.on(
  "unhandledRejection",
  (reason) => {

    logger.error(
      "Unhandled Rejection",
      { reason }
    )
  }
)

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});