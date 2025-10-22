"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const projects_1 = require("./routes/projects");
const assets_1 = require("./routes/assets");
const ai_1 = require("./routes/ai");
const community_1 = require("./routes/community");
const upload_1 = require("./routes/upload");
const analyze_1 = require("./routes/analyze");
const generate_code_1 = require("./routes/generate-code");
const training_1 = require("./routes/training");
const collaboration_1 = require("./services/collaboration");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
exports.io = io;
exports.redisClient = {
    connect: () => Promise.resolve(),
    lPush: () => Promise.resolve(),
    lTrim: () => Promise.resolve()
};
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_1.authRoutes);
app.use('/api/projects', projects_1.projectRoutes);
app.use('/api/assets', assets_1.assetRoutes);
app.use('/api/ai', ai_1.aiRoutes);
app.use('/api/community', community_1.communityRoutes);
app.use('/api/upload', upload_1.uploadRoutes);
app.use('/api/analyze', analyze_1.analyzeRoutes);
app.use('/api/generate-code', generate_code_1.generateCodeRoutes);
app.use('/api/training', training_1.trainingRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
(0, collaboration_1.collaborationHandler)(io);
app.use(errorHandler_1.errorHandler);
const connectDB = async () => {
    try {
        logger_1.logger.info('MongoDB connection skipped for demo');
    }
    catch (error) {
        logger_1.logger.error('MongoDB connection error:', error);
    }
};
const connectRedis = async () => {
    try {
        await exports.redisClient.connect();
        logger_1.logger.info('Redis connected successfully (mock)');
    }
    catch (error) {
        logger_1.logger.error('Redis connection error:', error);
    }
};
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await connectDB();
    await connectRedis();
    server.listen(PORT, () => {
        logger_1.logger.info(`Server running on port ${PORT}`);
    });
};
startServer().catch(error => {
    logger_1.logger.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map