// Register endpoint - Vercel Serverless Function
import { createClient } from '@supabase/supabase-js';

// RPG Titles
const RPG_PREFIXES = ['the Brave', 'the Wise', 'the Great', 'the Mighty', 'the Swift', 'the Bold', 'the Fearless', 'the Valiant', 'the Noble', 'the Just', 'the Fierce', 'the Cunning', 'the Legendary', 'the Mysterious', 'the Ancient', 'the Eternal', 'the Divine', 'the Radiant', 'the Shadow', 'the Storm', 'the Dragon', 'the Phoenix', 'the Ranger', 'the Wanderer', 'the Protector'];

const RPG_SUFFIXES = ['Slayer of Procrastination', 'Destroyer of Deadlines', 'Master of Tasks', 'Champion of Productivity', 'Keeper of Lists', 'Vanquisher of Chaos', 'Guardian of Goals', 'Conqueror of To-Dos', 'Wielder of Checkmarks', 'Bringer of Order', 'Seeker of Achievement', 'Hero of the Realm', 'Defender of Progress', 'Slayer of Dragons', 'Bearer of Quests', 'Hunter of XP', 'Collector of Achievements', 'Lord/Lady of Lists', 'Taskmaster Supreme', 'Champion of Completion'];

function generateRPGTitle() {
  const usePrefix = Math.random() > 0.5;
  if (usePrefix) {
    return RPG_PREFIXES[Math.floor(Math.random() * RPG_PREFIXES.length)];
  } else {
    return RPG_SUFFIXES[Math.floor(Math.random() * RPG_SUFFIXES.length)];
  }
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ 
        error: 'Email, password, and username are required' 
      });
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username is already taken. Please choose another username.'
      });
    }

    // Register user with Supabase Auth
    const rpgTitle = generateRPGTitle();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          rpg_title: rpgTitle
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        username,
        rpg_title: rpgTitle
      },
      session: data.session
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

