// React Query hook for levels
// Fetches all 21 levels with XP requirements

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetch all levels
 */
export const useLevels = () => {
  return useQuery({
    queryKey: ['levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('levels')
        .select('*')
        .order('level_number', { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: Infinity, // Levels never change, cache forever
  });
};

