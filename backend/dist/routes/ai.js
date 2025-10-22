"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AIJob_1 = require("../models/AIJob");
const auth_1 = require("../middleware/auth");
const aiQueue_1 = require("../services/aiQueue");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
exports.aiRoutes = router;
router.post('/jobs', auth_1.authMiddleware, async (req, res) => {
    try {
        const { type, input, projectId, priority = 0 } = req.body;
        const validTypes = ['design2code', 'refine', 'animation', 'generate'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid job type' });
        }
        const job = new AIJob_1.AIJob({
            type,
            userId: req.user.userId,
            projectId,
            input,
            priority,
            status: 'queued'
        });
        await job.save();
        await aiQueue_1.aiQueue.add('ai-job', {
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
        logger_1.logger.info(`AI job created: ${job._id} (${type}) by ${req.user.userId}`);
    }
    catch (error) {
        logger_1.logger.error('Create AI job error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/jobs/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const job = await AIJob_1.AIJob.findById(req.params.id);
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
    }
    catch (error) {
        logger_1.logger.error('Get AI job error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/jobs', auth_1.authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, type } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const query = { userId: req.user.userId };
        if (status) {
            query.status = status;
        }
        if (type) {
            query.type = type;
        }
        const jobs = await AIJob_1.AIJob.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-input.code -result.code');
        const total = await AIJob_1.AIJob.countDocuments(query);
        res.json({
            jobs,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get AI jobs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/jobs/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const job = await AIJob_1.AIJob.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        if (job.status === 'completed' || job.status === 'failed') {
            return res.status(400).json({ error: 'Cannot cancel completed or failed job' });
        }
        job.status = 'failed';
        job.error = 'Cancelled by user';
        await job.save();
        res.json({ message: 'Job cancelled successfully' });
        logger_1.logger.info(`AI job cancelled: ${job._id} by ${req.user.userId}`);
    }
    catch (error) {
        logger_1.logger.error('Cancel AI job error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/suggest', auth_1.authMiddleware, async (req, res) => {
    try {
        const { context, type = 'general' } = req.body;
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
            suggestions: suggestions[type] || suggestions.general,
            type,
            context
        });
    }
    catch (error) {
        logger_1.logger.error('AI suggestions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/callback', async (req, res) => {
    try {
        const { jobId, status, result, error, meta } = req.body;
        const job = await AIJob_1.AIJob.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        job.status = status;
        if (result)
            job.result = result;
        if (error)
            job.error = error;
        if (meta)
            job.meta = { ...job.meta, ...meta };
        await job.save();
        const io = require('../server').io;
        io.to(`user:${job.userId}`).emit('ai-job-update', {
            jobId: job._id,
            status: job.status,
            result: job.result,
            error: job.error
        });
        res.json({ message: 'Job updated successfully' });
        logger_1.logger.info(`AI job updated via callback: ${jobId} - ${status}`);
    }
    catch (error) {
        logger_1.logger.error('AI callback error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=ai.js.map