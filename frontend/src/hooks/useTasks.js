// React Query hook for tasks
// Manages task data fetching and mutations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

// Use relative URLs on production (Vercel), localhost for development
const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Fetch all tasks for authenticated user
 */
export const useTasks = (labelFilter = null) => {
  return useQuery({
    queryKey: ['tasks', labelFilter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('tasks')
        .select(`
          *,
          task_labels (
            label:labels (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;

      // Transform data to flatten labels
      return data.map(task => ({
        ...task,
        labels: task.task_labels?.map(tl => tl.label) || []
      }));
    }
  });
};

/**
 * Create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, priority, due_date, label_ids }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Call backend API to create task (handles achievement checking)
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ title, description, priority, due_date, label_ids })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }

      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      return data;
    }
  });
};

/**
 * Update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, description, priority, due_date, label_ids }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ title, description, priority, due_date })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update labels if provided
      if (label_ids !== undefined) {
        // Delete existing labels
        await supabase.from('task_labels').delete().eq('task_id', id);

        // Add new labels
        if (label_ids.length > 0) {
          const taskLabels = label_ids.map(label_id => ({
            task_id: id,
            label_id
          }));
          await supabase.from('task_labels').insert(taskLabels);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

/**
 * Complete a task
 */
export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Call backend API to complete task (handles XP + achievements)
      const response = await fetch(`${API_URL}/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete task');
      }

      const result = await response.json();
      return result;
    },
    onSuccess: async (data) => {
      // FORCE immediate refetch of profile to show XP/level changes
      await queryClient.refetchQueries({ queryKey: ['profile'] });
      
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      
      // Return achievement data for toast notifications
      return data;
    }
  });
};

/**
 * Delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

