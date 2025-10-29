// Check username availability - Vercel Serverless Function
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get username from URL path
    const username = req.url.split('/').pop();

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Username is required',
        available: false
      });
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Check if username exists in users table
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" - that's ok
      console.error('Username check error:', error);
      return res.status(500).json({ 
        error: 'Failed to check username',
        available: false
      });
    }

    // If data exists, username is taken
    const available = !data;

    res.json({ 
      available,
      message: available ? 'Username is available' : 'Username is already taken'
    });
  } catch (error) {
    console.error('Username check error:', error);
    res.status(500).json({ 
      error: 'Failed to check username',
      available: false
    });
  }
}

