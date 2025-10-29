// Vercel Serverless Function Handler
// This wraps the Express app for Vercel's serverless environment

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Try to load from parent if exists

// Import the Express app
import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from '../src/routes/auth.js';
import taskRoutes from '../src/routes/tasks.js';
import profileRoutes from '../src/routes/profile.js';
import labelRoutes from '../src/routes/labels.js';
import achievementRoutes from '../src/routes/achievements.js';
import levelRoutes from '../src/routes/levels.js';

const app = express();

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
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

export default app;


