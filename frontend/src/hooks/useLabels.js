// React Query hook for labels
// Manages label data fetching and mutations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetch all labels (user's custom labels + default labels)
 */
export const useLabels = () => {
  return useQuery({
    queryKey: ['labels'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .or(`user_id.eq.${user.id},is_default.eq.true`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    }
  });
};

/**
 * Create a new label
 */
export const useCreateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Call backend API to create label (handles achievement checking)
      const response = await fetch('http://localhost:3000/api/labels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create label');
      }

      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      return data;
    }
  });
};

/**
 * Update a label
 */
export const useUpdateLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('labels')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
    }
  });
};

/**
 * Delete a label
 */
export const useDeleteLabel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labelId) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('labels')
        .delete()
        .eq('id', labelId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
};

