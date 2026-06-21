const { app } = require('./app');
const { env } = require('./config/env');
const { connectMongo, closeMongoMemoryServer } = require('./config/mongo');
const { initializeFirebase, isFirebaseConfigured } = require('./config/firebase');
const Activity = require('./models/Activity');
const { ACTIVITY_SEED } = require('./scripts/seedActivities');
const mongoose = require('mongoose');

let httpServer = null;
let mongoRetryTimer = null;
let shuttingDown = false;

async function connectMongoWithRetry() {
  if (shuttingDown) {
    return;
  }

  try {
    const mode = await connectMongo({ allowMemoryFallback: env.nodeEnv !== 'production' });
    console.log(`MongoDB connection established (${mode}).`);
    await seedDefaultActivitiesIfNeeded(mode);
  } catch (error) {
    if (env.nodeEnv === 'production') {
      console.error(`MongoDB connection failed. Retrying in 15s. Reason: ${error.message}`);
      mongoRetryTimer = setTimeout(connectMongoWithRetry, 15000);
      return;
    }

    console.error(`MongoDB connection failed in development. Retrying in 15s. Reason: ${error.message}`);
    mongoRetryTimer = setTimeout(connectMongoWithRetry, 15000);
  }
}

async function seedDefaultActivitiesIfNeeded(mode) {
  if (env.nodeEnv === 'production') {
    return;
  }

  const total = await Activity.countDocuments();
  if (total > 0) {
    return;
  }

  for (const activity of ACTIVITY_SEED) {
    await Activity.findOneAndUpdate(
      { code: activity.code },
      { $set: activity },
      { upsert: true, new: true }
    );
  }

  const seededTotal = await Activity.countDocuments();
  console.log(`Seeded ${seededTotal} default activities in ${mode} mode.`);
}

async function closeMongoConnection() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

function setupGracefulShutdown() {
  async function shutdown(signal) {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log(`Received ${signal}. Starting graceful shutdown...`);

    if (mongoRetryTimer) {
      clearTimeout(mongoRetryTimer);
      mongoRetryTimer = null;
    }

    const forceExitTimer = setTimeout(() => {
      console.error('Graceful shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 15000);

    try {
      if (httpServer) {
        await new Promise((resolve, reject) => {
          httpServer.close((error) => (error ? reject(error) : resolve()));
        });
        console.log('HTTP server closed.');
      }

      await closeMongoConnection();
      await closeMongoMemoryServer();
      clearTimeout(forceExitTimer);
      process.exit(0);
    } catch (error) {
      clearTimeout(forceExitTimer);
      console.error('Error during graceful shutdown', error);
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

async function start() {
  initializeFirebase();
  setupGracefulShutdown();

  httpServer = app.listen(env.port, () => {
    console.log(
      `toddler-monitoring-api listening on port ${env.port} | firebaseConfigured=${isFirebaseConfigured()}`
    );
  });

  connectMongoWithRetry();
}

start().catch((error) => {
  console.error('Failed to boot server', error);
  process.exit(1);
});
