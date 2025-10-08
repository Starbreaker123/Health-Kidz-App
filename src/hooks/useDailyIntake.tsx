import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DailyIntake {
  total_calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vegetable_servings: number;
}

interface UseDailyIntakeReturn {
  dailyIntake: DailyIntake;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDailyIntake = (childId: string, date: string): UseDailyIntakeReturn => {
  const [dailyIntake, setDailyIntake] = useState<DailyIntake>({
    total_calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    vegetable_servings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDailyIntake = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First, get meals for the selected child and date
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('id, total_calories')
        .eq('child_id', childId)
        .eq('date', date);

      if (mealsError) throw mealsError;

      if (!meals || meals.length === 0) {
        setDailyIntake({
          total_calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          vegetable_servings: 0
        });
        return;
      }

      // Get all food items for these meals
      const mealIds = meals.map(meal => meal.id);
      const { data: foodItems, error: foodItemsError } = await supabase
        .from('food_items')
        .select('meal_id, protein_g, carbs_g, fat_g, name')
        .in('meal_id', mealIds);

      if (foodItemsError) throw foodItemsError;

      // Calculate total calories from meals
      const totalCalories = meals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);

      // Calculate macros from food items
      const macros = foodItems?.reduce((acc, item) => ({
        protein: acc.protein + (item.protein_g || 0),
        carbs: acc.carbs + (item.carbs_g || 0),
        fat: acc.fat + (item.fat_g || 0),
        vegetable_servings: acc.vegetable_servings + (item.name.toLowerCase().includes('vegetable') ? 1 : 0)
      }), {
        protein: 0,
        carbs: 0,
        fat: 0,
        vegetable_servings: 0
      }) || {
        protein: 0,
        carbs: 0,
        fat: 0,
        vegetable_servings: 0
      };

      setDailyIntake({
        total_calories: totalCalories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        vegetable_servings: macros.vegetable_servings
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch daily intake');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyIntake();
  }, [childId, date, user]);

  return {
    dailyIntake,
    loading,
    error,
    refetch: fetchDailyIntake
  };
};
