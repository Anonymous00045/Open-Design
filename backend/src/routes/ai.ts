import express from 'express';
import { AIJob } from '../models/AIJob';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { aiQueue } from '../services/aiQueue';
import { logger } from '../utils/logger';

const router = express.Router();

// Submit AI job
router.post('/jobs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { type, input, projectId, priority = 0 } = req.body;

    // Validate job type
    const validTypes = ['design2code', 'refine', 'animation', 'generate'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid job type' });
    }

    // Create job record
    const job = new AIJob({
      type,
      userId: req.user.userId,
      projectId,
      input,
      priority,
      status: 'queued'
    });

    await job.save();

    // Add to queue
    await aiQueue.add('ai-job', {
      jobId: job._id.toString(),
      type,
      input,
      userId: req.user.userId
    }, {
      priority,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });

    res.status(202).json({
      jobId: job._id,
      status: job.status,
      type: job.type,
      createdAt: job.createdAt
    });

    logger.info(`AI job created: ${job._id} (${type}) by ${req.user.userId}`);
  } catch (error) {
    logger.error('Create AI job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get job status
router.get('/jobs/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const job = await AIJob.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      jobId: job._id,
      type: job.type,
      status: job.status,
      result: job.result,
      error: job.error,
      meta: job.meta,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt
    });
  } catch (error) {
    logger.error('Get AI job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's AI jobs
router.get('/jobs', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = { userId: req.user.userId };

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    const jobs = await AIJob.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-input.code -result.code'); // Exclude large code fields for list view

    const total = await AIJob.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get AI jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel job
router.delete('/jobs/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const job = await AIJob.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (job.status === 'completed' || job.status === 'failed') {
      return res.status(400).json({ error: 'Cannot cancel completed or failed job' });
    }

    // Update job status
    job.status = 'failed';
    job.error = 'Cancelled by user';
    await job.save();

    // Remove from queue (if still queued)
    // This would depend on your queue implementation

    res.json({ message: 'Job cancelled successfully' });
    logger.info(`AI job cancelled: ${job._id} by ${req.user.userId}`);
  } catch (error) {
    logger.error('Cancel AI job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI suggestions endpoint
router.post('/suggest', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { context, type = 'general' } = req.body;

    // This would integrate with your AI service to provide suggestions
    // For now, return mock suggestions
    const suggestions = {
      general: [
        'Add a hero section with a compelling headline',
        'Use consistent spacing throughout your design',
        'Consider adding hover effects to interactive elements',
        'Implement a responsive grid layout'
      ],
      colors: [
        'Try using a complementary color scheme',
        'Add more contrast between text and background',
        'Consider using accent colors sparingly',
        'Use a consistent color palette throughout'
      ],
      layout: [
        'Align elements to a consistent grid',
        'Add more whitespace for better readability',
        'Group related elements together',
        'Use visual hierarchy to guide the user\'s eye'
      ]
    };

    res.json({
      suggestions: suggestions[type as keyof typeof suggestions] || suggestions.general,
      type,
      context
    });
  } catch (error) {
    logger.error('AI suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Webhook endpoint for AI service callbacks
router.post('/callback', async (req, res) => {
  try {
    const { jobId, status, result, error, meta } = req.body;

    // Verify webhook signature (implement based on your AI service)
    // const signature = req.headers['x-ai-signature'];
    // if (!verifySignature(signature, req.body)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const job = await AIJob.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Update job
    job.status = status;
    if (result) job.result = result;
    if (error) job.error = error;
    if (meta) job.meta = { ...job.meta, ...meta };

    await job.save();

    // Emit real-time update to user (if connected)
    const io = require('../server').io;
    io.to(`user:${job.userId}`).emit('ai-job-update', {
      jobId: job._id,
      status: job.status,
      result: job.result,
      error: job.error
    });

    res.json({ message: 'Job updated successfully' });
    logger.info(`AI job updated via callback: ${jobId} - ${status}`);
  } catch (error) {
    logger.error('AI callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as aiRoutes };