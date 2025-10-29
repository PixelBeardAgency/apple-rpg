// RPG Todo Backend Server
// Express + Supabase API

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import profileRoutes from './routes/profile.js';
import labelRoutes from './routes/labels.js';
import achievementRoutes from './routes/achievements.js';
import levelRoutes from './routes/levels.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'https://apple-rpg.vercel.app',
    /https:\/\/apple-rpg-.*\.vercel\.app$/  // Preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check (both /health and /api/health for compatibility)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RPG Todo API is running' });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RPG Todo API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/levels', levelRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server only in non-serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 RPG Todo API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
