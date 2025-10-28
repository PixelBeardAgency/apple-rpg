// React Query hook for tasks
// Manages task data fetching and mutations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title,
          description,
          priority,
          due_date
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Add label associations if provided
      if (label_ids && label_ids.length > 0) {
        const taskLabels = label_ids.map(label_id => ({
          task_id: task.id,
          label_id
        }));

        const { error: labelError } = await supabase
          .from('task_labels')
          .insert(taskLabels);

        if (labelError) throw labelError;
      }

      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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
      // Get task to calculate XP
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      const XP_VALUES = { HIGH: 100, MEDIUM: 50, LOW: 25 };
      const xpEarned = XP_VALUES[task.priority];

      // Mark complete
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          xp_earned: xpEarned
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Update user XP
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from('users')
        .select('total_xp, current_level')
        .eq('id', user.id)
        .single();

      const newTotalXP = userData.total_xp + xpEarned;

      await supabase
        .from('users')
        .update({ total_xp: newTotalXP })
        .eq('id', user.id);

      return { xpEarned, newTotalXP };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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

