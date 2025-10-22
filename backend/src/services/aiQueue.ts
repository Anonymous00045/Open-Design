import Bull from 'bull';
import { redisClient } from '../server';
import { AIJob } from '../models/AIJob';
import { logger } from '../utils/logger';
import axios from 'axios';

// Create AI job queue
export const aiQueue = new Bull('ai-jobs', {
  redis: {
    port: parseInt(process.env.REDIS_PORT || '6379'),
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD
  }
});

// Process AI jobs
aiQueue.process('ai-job', async (job) => {
  const { jobId, type, input, userId } = job.data;
  
  try {
    logger.info(`Processing AI job: ${jobId} (${type})`);
    
    // Update job status
    await AIJob.findByIdAndUpdate(jobId, { 
      status: 'running',
      'meta.startedAt': new Date()
    });

    // Call AI microservice
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const response = await axios.post(`${aiServiceUrl}/process`, {
      job_id: jobId,
      type,
      input,
      user_id: userId
    }, {
      timeout: 300000, // 5 minutes timeout
      headers: {
        'Authorization': `Bearer ${process.env.AI_SERVICE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // Update job with result
    const processingTime = Date.now() - job.timestamp;
    await AIJob.findByIdAndUpdate(jobId, {
      status: 'completed',
      result: response.data.result,
      'meta.processingTime': processingTime,
      'meta.completedAt': new Date()
    });

    logger.info(`AI job completed: ${jobId} in ${processingTime}ms`);
    return response.data;

  } catch (error) {
    logger.error(`AI job failed: ${jobId}`, error);
    
    // Update job with error
    await AIJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      'meta.failedAt': new Date()
    });

    throw error;
  }
});

// Job event handlers
aiQueue.on('completed', (job, result) => {
  logger.info(`AI job completed: ${job.id}`);
});

aiQueue.on('failed', (job, err) => {
  logger.error(`AI job failed: ${job.id}`, err);
});

aiQueue.on('stalled', (job) => {
  logger.warn(`AI job stalled: ${job.id}`);
});

// Clean up old jobs
aiQueue.clean(24 * 60 * 60 * 1000, 'completed'); // Remove completed jobs after 24 hours
aiQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed'); // Remove failed jobs after 7 days