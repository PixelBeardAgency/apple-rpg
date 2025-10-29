// Vercel Serverless Function Handler
// Dynamic import approach for ESM compatibility

export default async function handler(req, res) {
  try {
    // Debug logging
    console.log('=== SERVERLESS FUNCTION STARTING ===');
    console.log('Environment variables check:');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'EXISTS' : 'MISSING');
    console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'EXISTS' : 'MISSING');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'EXISTS' : 'MISSING');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Request:', req.method, req.url);

    // Dynamically import express and create app
    const express = (await import('express')).default;
    const cors = (await import('cors')).default;
    
    // Import routes dynamically
    const { default: authRoutes } = await import('../backend/src/routes/auth.js');
    const { default: taskRoutes } = await import('../backend/src/routes/tasks.js');
    const { default: profileRoutes } = await import('../backend/src/routes/profile.js');
    const { default: labelRoutes } = await import('../backend/src/routes/labels.js');
    const { default: achievementRoutes } = await import('../backend/src/routes/achievements.js');
    const { default: levelRoutes } = await import('../backend/src/routes/levels.js');

    const app = express();

    // Middleware
    app.use(cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'https://apple-rpg.vercel.app',
        /https:\/\/apple-rpg-.*\.vercel\.app$/
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    app.use(express.json());

    // Request logging
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });

    // Health check
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

    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      error: 'Function initialization failed',
      message: error.message 
    });
  }
}


