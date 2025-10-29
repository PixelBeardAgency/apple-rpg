// Task operations - Vercel Serverless Function
// Handles PATCH (update), DELETE (delete)
import { createClient } from '@supabase/supabase-js';

// Auth helper
async function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  const token = authHeader.substring(7);
  
  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    }
  );

  const { data: { user }, error } = await userClient.auth.getUser();
  
  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

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

  // PATCH - Update task
  if (req.method === 'PATCH') {
    try {
      const { title, description, priority, due_date, label_ids } = req.body;

      // Update task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .update({
          title,
          description,
          priority,
          due_date
        })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (taskError) throw taskError;

      // Update labels if provided
      if (label_ids !== undefined) {
        // Delete existing labels
        await supabase
          .from('task_labels')
          .delete()
          .eq('task_id', id);

        // Add new labels
        if (label_ids.length > 0) {
          const taskLabels = label_ids.map(label_id => ({
            task_id: id,
            label_id
          }));

          await supabase
            .from('task_labels')
            .insert(taskLabels);
        }
      }

      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
  // DELETE - Delete task
  else if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
