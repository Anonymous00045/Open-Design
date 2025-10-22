"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const AIJob_1 = require("../models/AIJob");
const logger_1 = require("../utils/logger");
const axios_1 = __importDefault(require("axios"));
exports.aiQueue = new bull_1.default('ai-jobs', {
    redis: {
        port: parseInt(process.env.REDIS_PORT || '6379'),
        host: process.env.REDIS_HOST || 'localhost',
        password: process.env.REDIS_PASSWORD
    }
});
exports.aiQueue.process('ai-job', async (job) => {
    const { jobId, type, input, userId } = job.data;
    try {
        logger_1.logger.info(`Processing AI job: ${jobId} (${type})`);
        await AIJob_1.AIJob.findByIdAndUpdate(jobId, {
            status: 'running',
            'meta.startedAt': new Date()
        });
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const response = await axios_1.default.post(`${aiServiceUrl}/process`, {
            job_id: jobId,
            type,
            input,
            user_id: userId
        }, {
            timeout: 300000,
            headers: {
                'Authorization': `Bearer ${process.env.AI_SERVICE_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        const processingTime = Date.now() - job.timestamp;
        await AIJob_1.AIJob.findByIdAndUpdate(jobId, {
            status: 'completed',
            result: response.data.result,
            'meta.processingTime': processingTime,
            'meta.completedAt': new Date()
        });
        logger_1.logger.info(`AI job completed: ${jobId} in ${processingTime}ms`);
        return response.data;
    }
    catch (error) {
        logger_1.logger.error(`AI job failed: ${jobId}`, error);
        await AIJob_1.AIJob.findByIdAndUpdate(jobId, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            'meta.failedAt': new Date()
        });
        throw error;
    }
});
exports.aiQueue.on('completed', (job, result) => {
    logger_1.logger.info(`AI job completed: ${job.id}`);
});
exports.aiQueue.on('failed', (job, err) => {
    logger_1.logger.error(`AI job failed: ${job.id}`, err);
});
exports.aiQueue.on('stalled', (job) => {
    logger_1.logger.warn(`AI job stalled: ${job.id}`);
});
exports.aiQueue.clean(24 * 60 * 60 * 1000, 'completed');
exports.aiQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed');
//# sourceMappingURL=aiQueue.js.map