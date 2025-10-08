import { useState, useMemo } from 'react';
import { analyzeNutrientGaps } from '@/services/spoonacularApi';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useAdvancedInsights } from '@/hooks/useAdvancedInsights';
import { useChildrenData } from '@/hooks/useChildrenData';
import { useOptimizedDailyIntake } from '@/hooks/useOptimizedDailyIntake';
import { useDailyIntake } from '@/hooks/useDailyIntake';
import { calculateNutritionalGoals } from '@/utils/nutritionalGoalsCalculator';
import { processMacroData } from '@/utils/macroDataProcessor';

// Optimized cache for API calls with automatic cleanup
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

const cleanupCache = () => {
  if (queryCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = Array.from(queryCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest 50% of entries
    const toRemove = Math.floor(sortedEntries.length / 2);
    sortedEntries.slice(0, toRemove).forEach(([key]) => {
      queryCache.delete(key);
    });
  }
};

export const useProgressData = (user: any) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedChild,
    loading: childrenLoading
  } = useChildrenData(user);

  const {
    dailyIntake,
    loading: dailyLoading,
    error: dailyError,
    refetch: refetchDailyIntake
  } = useDailyIntake(selectedChildId, selectedDate);

  const {
    loading: analyticsLoading,
    nutritionHistory,
    insights,
    weeklyStats,
    goalsAchieved,
    totalGoals,
    streak,
    error: analyticsError
  } = useAdvancedAnalytics(selectedChild, 14);

  const {
    loading: advancedLoading,
    advancedInsights,
    mealPatterns,
    eatingPatterns,
    weeklyComparisons,
    monthlyComparisons,
    error: insightsError
  } = useAdvancedInsights(selectedChild, 30);

  // Optimized memoized calculations
  const nutritionalGoals = useMemo(() => 
    calculateNutritionalGoals(selectedChild, dailyIntake), 
    [selectedChild, dailyIntake]
  );

  const nutrientGaps = useMemo(() => {
    if (!selectedChild) return [];
    const cacheKey = `gaps-${selectedChild.id}-${JSON.stringify(dailyIntake)}`;
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    // Convert dailyIntake to Record<string, number> format
    const dailyIntakeRecord = {
      calories: dailyIntake.total_calories || 0,
      protein_g: dailyIntake.protein || 0,
      carbs_g: dailyIntake.carbs || 0,
      fat_g: dailyIntake.fat || 0,
      vegetable_servings: dailyIntake.vegetable_servings || 0
    } as Record<string, number>;
    // Extract personalized targets from nutritionalGoals
    const customTargets: Record<string, number> = {};
    nutritionalGoals.forEach(goal => {
      customTargets[goal.nutrient] = goal.target;
    });
    const gaps = analyzeNutrientGaps(dailyIntakeRecord, selectedChild, customTargets);
    queryCache.set(cacheKey, { data: gaps, timestamp: Date.now() });
    // Cleanup cache periodically
    cleanupCache();
    return gaps;
  }, [selectedChild, dailyIntake, nutritionalGoals]);

  const enhancedNutritionHistory = useMemo(() => 
    nutritionHistory.map(day => ({
      ...day,
      fiber: Math.max(5, (day.protein + day.carbs) * 0.1)
    })), 
    [nutritionHistory]
  );

  const macroData = useMemo(() => processMacroData({
    calories: dailyIntake.total_calories || 0,
    protein_g: dailyIntake.protein || 0,
    carbs_g: dailyIntake.carbs || 0,
    fat_g: dailyIntake.fat || 0
  }), [dailyIntake]);

  // Aggregate loading states
  const loading = childrenLoading || dailyLoading || analyticsLoading || advancedLoading;

  // Aggregate error states
  const hasErrors = dailyError || analyticsError || insightsError;

  return {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedDate,
    setSelectedDate,
    loading,
    dailyIntake,
    nutritionalGoals,
    nutrientGaps,
    enhancedNutritionHistory,
    macroData,
    insights,
    selectedChild,
    weeklyStats,
    goalsAchieved,
    totalGoals,
    streak,
    advancedInsights,
    weeklyComparisons,
    monthlyComparisons,
    mealPatterns,
    eatingPatterns,
    errors: {
      daily: dailyError,
      analytics: analyticsError,
      insights: insightsError
    },
    hasErrors,
    refetch: {
      dailyIntake: refetchDailyIntake
    }
  };
};
