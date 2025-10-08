
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DailyIntakeState {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_glasses: number;
}

// Cache for daily intake data
const dailyIntakeCache = new Map<string, { data: DailyIntakeState; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export const useOptimizedDailyIntake = (selectedChildId: string, selectedDate: string) => {
  const [dailyIntake, setDailyIntake] = useState<DailyIntakeState>({
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    water_glasses: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const cacheKey = `${selectedChildId}-${selectedDate}`;

  const fetchDailyIntake = useCallback(async () => {
    if (!selectedChildId || !selectedDate) return;

    // Check cache first
    const cached = dailyIntakeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setDailyIntake(cached.data);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Fixed query with explicit relationship specification
      const { data: mealsWithItems, error: mealsError } = await supabase
        .from('meals')
        .select(`
          total_calories,
          water_glasses,
          food_items!food_items_meal_id_fkey (
            quantity,
            protein_g,
            carbs_g,
            fat_g
          )
        `)
        .eq('child_id', selectedChildId)
        .eq('date', selectedDate);

      if (mealsError) {
        throw new Error(`Failed to load daily intake: ${mealsError.message}`);
      }

      const intake: DailyIntakeState = {
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        water_glasses: 0
      };

      mealsWithItems?.forEach(meal => {
        intake.calories += meal.total_calories || 0;
        intake.water_glasses += meal.water_glasses || 0;

        // Process food items efficiently
        meal.food_items?.forEach((item: any) => {
          const quantity = item.quantity || 1;
          intake.protein_g += (item.protein_g || 0) * quantity;
          intake.carbs_g += (item.carbs_g || 0) * quantity;
          intake.fat_g += (item.fat_g || 0) * quantity;
        });
      });

      // Cache the result
      dailyIntakeCache.set(cacheKey, {
        data: intake,
        timestamp: Date.now()
      });

      setDailyIntake(intake);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load daily nutrition data';
      setError(errorMessage);
      toast({
        title: "Unable to Load Nutrition Data",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedChildId, selectedDate, cacheKey, toast]);

  useEffect(() => {
    fetchDailyIntake();
  }, [fetchDailyIntake]);

  const invalidateCache = useCallback(() => {
    dailyIntakeCache.delete(cacheKey);
    fetchDailyIntake();
  }, [cacheKey, fetchDailyIntake]);

  return {
    dailyIntake,
    loading,
    error,
    refetch: fetchDailyIntake,
    invalidateCache
  };
};
