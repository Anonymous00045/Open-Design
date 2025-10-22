import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Redis from 'redis';
import dotenv from 'dotenv';

import { authRoutes } from './routes/auth';
import { projectRoutes } from './routes/projects';
import { assetRoutes } from './routes/assets';
import { aiRoutes } from './routes/ai';
import { communityRoutes } from './routes/community';
import { uploadRoutes } from './routes/upload';
import { analyzeRoutes } from './routes/analyze';
import { generateCodeRoutes } from './routes/generate-code';
import { trainingRoutes } from './routes/training';
import { collaborationHandler } from './services/collaboration';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Redis client (simplified for demo)
export const redisClient = {
  connect: () => Promise.resolve(),
  lPush: () => Promise.resolve(),
  lTrim: () => Promise.resolve()
};

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/generate-code', generateCodeRoutes);
app.use('/api/training', trainingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Collaboration WebSocket handler
collaborationHandler(io);

// Error handling
app.use(errorHandler);

// Database connection (simplified for demo)
const connectDB = async () => {
  try {
    // Skip actual MongoDB connection for demo
    logger.info('MongoDB connection skipped for demo');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
  }
};

// Redis connection (simplified)
const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully (mock)');
  } catch (error) {
    logger.error('Redis connection error:', error);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await connectRedis();
  
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer().catch(error => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export { app, io };