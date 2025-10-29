// Label operations - Vercel Serverless Function
// Handles PATCH (update) and DELETE (delete)
import { createClient } from '@supabase/supabase-js';

// Auth helper
async function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  const token = authHeader.substring(7);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }

  return { userId: user.id, supabase };
}

export default async function handler(req, res) {
  // Authenticate
  const authResult = await authenticate(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { userId, supabase } = authResult;
  const id = req.query.id;

  // PATCH - Update label
  if (req.method === 'PATCH') {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Label name is required' });
      }

      const { data, error } = await supabase
        .from('labels')
        .update({ name })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Label name already exists' });
        }
        throw error;
      }

      res.json(data);
    } catch (error) {
      console.error('Error updating label:', error);
      res.status(500).json({ error: 'Failed to update label' });
    }
  }
  // DELETE - Delete label
  else if (req.method === 'DELETE') {
    try {
      // Check if label belongs to user
      const { data: label, error: checkError } = await supabase
        .from('labels')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (checkError || !label) {
        return res.status(404).json({ error: 'Label not found' });
      }

      // Delete label (CASCADE will remove from task_labels automatically)
      const { error: deleteError } = await supabase
        .from('labels')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      res.json({ message: 'Label deleted successfully' });
    } catch (error) {
      console.error('Error deleting label:', error);
      res.status(500).json({ error: 'Failed to delete label' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

