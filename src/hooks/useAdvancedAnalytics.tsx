
import { useState, useEffect } from 'react';
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

interface NutritionDay {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const useAdvancedAnalytics = (selectedChild: Child | undefined, days: number = 14) => {
  const [loading, setLoading] = useState(false);
  const [nutritionHistory, setNutritionHistory] = useState<NutritionDay[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any>({});
  const [goalsAchieved, setGoalsAchieved] = useState(0);
  const [totalGoals, setTotalGoals] = useState(4);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedChild) {
      fetchAnalyticsData();
    }
  }, [selectedChild, days]);

  const fetchAnalyticsData = async () => {
    if (!selectedChild) return;
    
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

      // Process nutrition history efficiently
      const nutritionByDate = new Map<string, NutritionDay>();
      
      mealsWithItems?.forEach(meal => {
        if (!nutritionByDate.has(meal.date)) {
          nutritionByDate.set(meal.date, {
            date: meal.date,
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          });
        }
        
        const dayData = nutritionByDate.get(meal.date)!;
        dayData.calories += meal.total_calories || 0;

        // Process food items in the same loop
        meal.food_items?.forEach((item: any) => {
          const quantity = item.quantity || 1;
          dayData.protein += (item.protein_g || 0) * quantity;
          dayData.carbs += (item.carbs_g || 0) * quantity;
          dayData.fat += (item.fat_g || 0) * quantity;
        });
      });

      const historyArray = Array.from(nutritionByDate.values()).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setNutritionHistory(historyArray);

      // Calculate analytics efficiently
      const totalDays = historyArray.length;
      if (totalDays > 0) {
        const totals = historyArray.reduce((acc, day) => ({
          calories: acc.calories + day.calories,
          protein: acc.protein + day.protein,
          carbs: acc.carbs + day.carbs,
          fat: acc.fat + day.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        setWeeklyStats({
          avgCalories: Math.round(totals.calories / totalDays),
          totalDays,
          avgProtein: Math.round(totals.protein / totalDays),
          avgCarbs: Math.round(totals.carbs / totalDays),
          avgFat: Math.round(totals.fat / totalDays)
        });

        // Generate insights based on data
        const generatedInsights = [];
        if (totals.protein / totalDays > 30) {
          generatedInsights.push({ type: 'positive', message: 'Great protein intake this week!' });
        }
        if (totals.calories / totalDays < 1500) {
          generatedInsights.push({ type: 'suggestion', message: 'Consider adding more nutritious snacks.' });
        }
        setInsights(generatedInsights);
      }

      // Calculate goals and streak (simplified for performance)
      setGoalsAchieved(Math.min(4, Math.floor(totalDays / 3)));
      setStreak(Math.min(7, totalDays));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load nutrition analytics';
      setError(errorMessage);
      toast({
        title: "Analytics Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    nutritionHistory,
    insights,
    weeklyStats,
    goalsAchieved,
    totalGoals,
    streak,
    error,
    refetch: fetchAnalyticsData
  };
};
