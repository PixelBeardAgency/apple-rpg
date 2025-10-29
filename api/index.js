// Vercel Serverless Function Handler
// This wraps the Express app for Vercel's serverless environment

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Try to load from parent if exists

// Import the Express app
import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from '../backend/src/routes/auth.js';
import taskRoutes from '../backend/src/routes/tasks.js';
import profileRoutes from '../backend/src/routes/profile.js';
import labelRoutes from '../backend/src/routes/labels.js';
import achievementRoutes from '../backend/src/routes/achievements.js';
import levelRoutes from '../backend/src/routes/levels.js';

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
  console.log(`${req.method} ${req.path} - Full URL: ${req.url}`);
  next();
});

// Health check - responds to /api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RPG Todo API is running' });
});

// API Routes - already prefixed with /api/ by Vercel routing
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


