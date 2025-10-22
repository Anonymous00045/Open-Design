import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Simple routes
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

// Start server
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`[INFO] Server running on port ${PORT}`);
  console.log(`[INFO] Health check: http://localhost:${PORT}/health`);
});

export { app };