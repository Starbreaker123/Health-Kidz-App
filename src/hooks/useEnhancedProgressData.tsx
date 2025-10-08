import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateClinicalNutritionRecommendations } from '@/utils/clinicalNutritionCalculator';
import { analyzeNutrientGaps } from '@/services/spoonacularApi';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useAdvancedInsights } from '@/hooks/useAdvancedInsights';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
}

interface ErrorState {
  children: string | null;
  dailyIntake: string | null;
  general: string | null;
}

export const useEnhancedProgressData = (user: any) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [dailyIntake, setDailyIntake] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<ErrorState>({
    children: null,
    dailyIntake: null,
    general: null
  });
  const { toast } = useToast();

  const selectedChild = children.find(child => child.id === selectedChildId);
  
  const {
    loading: analyticsLoading,
    nutritionHistory,
    insights,
    weeklyStats,
    goalsAchieved,
    totalGoals,
    streak
  } = useAdvancedAnalytics(selectedChild, 14);

  const {
    loading: advancedLoading,
    advancedInsights,
    mealPatterns,
    eatingPatterns,
    weeklyComparisons,
    monthlyComparisons
  } = useAdvancedInsights(selectedChild, 30);

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChildId && selectedDate) {
      fetchDailyIntake();
    }
  }, [selectedChildId, selectedDate]);

  const fetchChildren = async () => {
    try {
      setErrors(prev => ({ ...prev, children: null }));
      
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load children: ${error.message}`);
      }
      
      setChildren(data || []);
      if (data && data.length > 0) {
        setSelectedChildId(data[0].id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load children profiles';
      console.error('Error fetching children:', error);
      
      setErrors(prev => ({ ...prev, children: errorMessage }));
      toast({
        title: "Unable to Load Children",
        description: errorMessage + ". Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyIntake = async () => {
    if (!selectedChildId || !selectedDate) return;
    
    try {
      setErrors(prev => ({ ...prev, dailyIntake: null }));
      
      // Fixed query with explicit relationship specification
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('id, total_calories')
        .eq('child_id', selectedChildId)
        .eq('date', selectedDate);

      if (mealsError) {
        throw new Error(`Failed to load daily nutrition data: ${mealsError.message}`);
      }

      const intake = {
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0
      };

      if (meals && meals.length > 0) {
        // Calculate calories from meals
        meals.forEach(meal => {
          intake.calories += meal.total_calories || 0;
        });

        // Get food items for all meals separately with explicit relationship
        const mealIds = meals.map(meal => meal.id);
        const { data: foodItems, error: foodItemsError } = await supabase
          .from('food_items')
          .select('quantity, protein_g, carbs_g, fat_g')
          .in('meal_id', mealIds);

        if (foodItemsError) {
          console.warn('Could not load food items:', foodItemsError.message);
          // Continue without food items data
        } else if (foodItems) {
          // Calculate macros from food items
          foodItems.forEach(item => {
            const quantity = item.quantity || 1;
            intake.protein_g += (item.protein_g || 0) * quantity;
            intake.carbs_g += (item.carbs_g || 0) * quantity;
            intake.fat_g += (item.fat_g || 0) * quantity;
          });
        }
      }

      setDailyIntake(intake);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load daily nutrition data';
      console.error('Error fetching daily intake:', error);
      
      setErrors(prev => ({ ...prev, dailyIntake: errorMessage }));
      toast({
        title: "Unable to Load Nutrition Data",
        description: errorMessage + ". Please try again or select a different date.",
        variant: "destructive",
      });
    }
  };

  // Memoized calculations to prevent unnecessary recalculations
  const recommendations = selectedChild ? calculateClinicalNutritionRecommendations(selectedChild) : null;
  const nutrientGaps = selectedChild && recommendations
    ? analyzeNutrientGaps(dailyIntake, selectedChild, {
        calories: recommendations.calories,
        protein_g: recommendations.protein_g,
        carbs_g: recommendations.carbs_g,
        fat_g: recommendations.fat_g
      })
    : [];

  const nutritionalGoals = recommendations ? [
    { nutrient: 'calories', current: dailyIntake.calories || 0, target: recommendations.calories, unit: 'cal', displayName: 'Calories' },
    { nutrient: 'protein_g', current: dailyIntake.protein_g || 0, target: recommendations.protein_g, unit: 'g', displayName: 'Protein' },
    { nutrient: 'carbs_g', current: dailyIntake.carbs_g || 0, target: recommendations.carbs_g, unit: 'g', displayName: 'Carbs' },
    { nutrient: 'fat_g', current: dailyIntake.fat_g || 0, target: recommendations.fat_g, unit: 'g', displayName: 'Fat' }
  ] : [];

  const enhancedNutritionHistory = nutritionHistory.map(day => ({
    ...day,
    fiber: Math.max(5, (day.protein + day.carbs) * 0.1)
  }));

  const macroData = [
    { name: 'Protein', value: dailyIntake.protein_g || 0, color: '#10B981', percentage: Math.round(((dailyIntake.protein_g || 0) * 4 / (dailyIntake.calories || 1)) * 100) },
    { name: 'Carbs', value: dailyIntake.carbs_g || 0, color: '#3B82F6', percentage: Math.round(((dailyIntake.carbs_g || 0) * 4 / (dailyIntake.calories || 1)) * 100) },
    { name: 'Fat', value: dailyIntake.fat_g || 0, color: '#F59E0B', percentage: Math.round(((dailyIntake.fat_g || 0) * 9 / (dailyIntake.calories || 1)) * 100) }
  ];

  return {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedDate,
    setSelectedDate,
    loading: loading || analyticsLoading || advancedLoading,
    selectedChild,
    dailyIntake,
    nutritionalGoals,
    nutrientGaps,
    enhancedNutritionHistory,
    macroData,
    weeklyStats,
    goalsAchieved,
    totalGoals,
    streak,
    advancedInsights,
    weeklyComparisons,
    monthlyComparisons,
    mealPatterns,
    eatingPatterns,
    insights,
    errors,
    refetch: {
      children: fetchChildren,
      dailyIntake: fetchDailyIntake
    }
  };
};
