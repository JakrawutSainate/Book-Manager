import 'dotenv/config';
import { createApp } from './app';
import { PORT } from './config';
import { connectDB, closeDB } from './database/db';

const startServer = async () => {
  try {
    await connectDB();

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`[Server] Running at http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`[Server] Caught ${signal}, shutting down...`);
      await closeDB();
      server.close(() => {
        console.log('[Server] HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    console.error('[Server] Exiting due to DB connection failure');
    console.error(err);
    process.exit(1);
  }
};

startServer();
