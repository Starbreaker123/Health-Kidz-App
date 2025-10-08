
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Meal {
  id: string;
  child_id: string;
  name: string;
  meal_type: string;
  date: string;
  total_calories: number;
  notes?: string;
}

interface PaginatedMealsResult {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalCount: number;
}

export const usePaginatedMeals = (childId: string, pageSize: number = 20): PaginatedMealsResult => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchMeals = async (isLoadMore: boolean = false) => {
    if (!childId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get total count for pagination info
      const { count } = await supabase
        .from('meals')
        .select('*', { count: 'exact', head: true })
        .eq('child_id', childId);

      setTotalCount(count || 0);

      // Fetch paginated meals with optimized query
      const { data, error: fetchError } = await supabase
        .from('meals')
        .select('id, child_id, name, meal_type, date, total_calories, notes')
        .eq('child_id', childId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .range(isLoadMore ? offset : 0, (isLoadMore ? offset : 0) + pageSize - 1);

      if (fetchError) {
        throw new Error(`Failed to load meals: ${fetchError.message}`);
      }

      const newMeals = data || [];
      
      if (isLoadMore) {
        setMeals(prev => [...prev, ...newMeals]);
        setOffset(prev => prev + pageSize);
      } else {
        setMeals(newMeals);
        setOffset(pageSize);
      }

      setHasMore(newMeals.length === pageSize && (isLoadMore ? offset + pageSize : pageSize) < (count || 0));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load meals';
      setError(errorMessage);
      toast({
        title: "Error Loading Meals",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchMeals(true);
    }
  };

  const refresh = () => {
    setOffset(0);
    setMeals([]);
    setHasMore(true);
    fetchMeals(false);
  };

  useEffect(() => {
    if (childId) {
      refresh();
    }
  }, [childId]);

  return {
    meals,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount
  };
};
