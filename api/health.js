// Simple health check endpoint
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'RPG Todo API is running',
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 30)}...` : 'MISSING',
      nodeEnv: process.env.NODE_ENV
    }
  });
}
