const mongoose = require('mongoose');
const { env } = require('./env');

let memoryServer = null;
let connectionMode = null;

async function getMemoryServer() {
  if (!memoryServer) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
  }

  return memoryServer;
}

async function connectMongo({ allowMemoryFallback = false } = {}) {
  if (mongoose.connection.readyState === 1) {
    return connectionMode || 'connected';
  }

  if (env.mongodbUri) {
    try {
      await mongoose.connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 10000
      });
      connectionMode = 'uri';
      return connectionMode;
    } catch (error) {
      if (!allowMemoryFallback || env.nodeEnv === 'production') {
        throw error;
      }
      console.warn(`MongoDB connection failed, falling back to in-memory mode. Reason: ${error.message}`);
    }
  } else if (!allowMemoryFallback || env.nodeEnv === 'production') {
    throw new Error('Missing MONGODB_URI environment variable.');
  }

  if (!memoryServer) {
    await getMemoryServer();
  }

  await mongoose.connect(memoryServer.getUri(), {
    serverSelectionTimeoutMS: 10000
  });
  connectionMode = 'memory';
  return connectionMode;
}

function getMongoConnectionMode() {
  return connectionMode;
}

async function closeMongoMemoryServer() {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
    connectionMode = null;
  }
}

module.exports = { connectMongo, closeMongoMemoryServer, getMongoConnectionMode };
