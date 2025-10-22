"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.get('/api/projects', (req, res) => {
    res.json({
        projects: [
            { id: '1', title: 'Sample Project', description: 'A demo project' }
        ]
    });
});
app.post('/api/auth/login', (req, res) => {
    res.json({
        token: 'demo-token',
        user: { id: '1', email: 'demo@example.com', name: 'Demo User' }
    });
});
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`[INFO] Server running on port ${PORT}`);
    console.log(`[INFO] Health check: http://localhost:${PORT}/health`);
});
//# sourceMappingURL=server-simple.js.map