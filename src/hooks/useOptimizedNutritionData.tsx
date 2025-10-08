
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface NutritionSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}

// Query cache to prevent duplicate API calls
const nutritionCache = new Map<string, { data: NutritionSummary[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOptimizedNutritionData = (selectedChild: Child | undefined, days: number = 30) => {
  const [nutritionData, setNutritionData] = useState<NutritionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const cacheKey = useMemo(() => 
    selectedChild ? `${selectedChild.id}-${days}` : null,
    [selectedChild?.id, days]
  );

  const fetchNutritionData = async () => {
    if (!selectedChild || !cacheKey) return;

    // Check cache first
    const cached = nutritionCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setNutritionData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Fixed query with explicit relationship specification
      const { data: mealsWithItems, error: mealsError } = await supabase
        .from('meals')
        .select(`
          date,
          total_calories,
          food_items!food_items_meal_id_fkey (
            quantity,
            protein_g,
            carbs_g,
            fat_g
          )
        `)
        .eq('child_id', selectedChild.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (mealsError) {
        throw new Error(`Failed to load nutrition data: ${mealsError.message}`);
      }

      // Process data efficiently
      const nutritionByDate = new Map<string, NutritionSummary>();

      mealsWithItems?.forEach(meal => {
        if (!nutritionByDate.has(meal.date)) {
          nutritionByDate.set(meal.date, {
            date: meal.date,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            mealCount: 0
          });
        }

        const summary = nutritionByDate.get(meal.date)!;
        summary.totalCalories += meal.total_calories || 0;
        summary.mealCount += 1;

        // Process food items
        meal.food_items?.forEach((item: any) => {
          const quantity = item.quantity || 1;
          summary.totalProtein += (item.protein_g || 0) * quantity;
          summary.totalCarbs += (item.carbs_g || 0) * quantity;
          summary.totalFat += (item.fat_g || 0) * quantity;
        });
      });

      const processedData = Array.from(nutritionByDate.values());
      
      // Cache the result
      nutritionCache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      // Clean old cache entries
      if (nutritionCache.size > 50) {
        const oldEntries = Array.from(nutritionCache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)
          .slice(0, 25);
        oldEntries.forEach(([key]) => nutritionCache.delete(key));
      }

      setNutritionData(processedData);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load nutrition data';
      setError(errorMessage);
      toast({
        title: "Nutrition Data Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNutritionData();
  }, [selectedChild?.id, days]);

  // Memoized calculations
  const summary = useMemo(() => {
    if (nutritionData.length === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        totalDays: 0
      };
    }

    const totalDays = nutritionData.length;
    return {
      avgCalories: Math.round(nutritionData.reduce((sum, day) => sum + day.totalCalories, 0) / totalDays),
      avgProtein: Math.round(nutritionData.reduce((sum, day) => sum + day.totalProtein, 0) / totalDays),
      avgCarbs: Math.round(nutritionData.reduce((sum, day) => sum + day.totalCarbs, 0) / totalDays),
      avgFat: Math.round(nutritionData.reduce((sum, day) => sum + day.totalFat, 0) / totalDays),
      totalDays
    };
  }, [nutritionData]);

  return {
    nutritionData,
    summary,
    loading,
    error,
    refetch: fetchNutritionData
  };
};
