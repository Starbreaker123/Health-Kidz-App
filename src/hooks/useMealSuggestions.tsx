import { useState, useEffect } from 'react';
import { searchMealsByNutrients } from '@/services/spoonacularApi';
import { searchMealsByMealType } from '@/services/edamamApi';
import { Child, Meal, FoodItem } from '@/types';
import { logger } from '@/lib/logger';


interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  prepTime: number;
  servings: number;
  targetNutrients: string[];
  mealType: string;
  difficulty: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const useMealSuggestions = (
  selectedChild: Child | undefined,
  meals: Meal[],
  foodItems: { [mealId: string]: FoodItem[] }
) => {
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletedSuggestionIds, setDeletedSuggestionIds] = useState<string[]>([]);

  const getCurrentMealType = (): string => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 6 && currentHour < 11) {
      return 'breakfast';
    } else if (currentHour >= 11 && currentHour < 16) {
      return 'lunch';
    } else if (currentHour >= 16 && currentHour < 21) {
      return 'dinner';
    } else {
      return 'snack';
    }
  };

  const calculateTargetNutrients = (childAge: number, mealType: string): { [key: string]: number } => {
    // Calculate basic nutrient targets based on child age and meal type
    let baseCalories = 0;
    let baseProtein = 0;
    let baseCarbs = 0;
    let baseFat = 0;

    // Age-based daily nutritional needs (simplified)
    if (childAge < 3) {
      baseCalories = 1000;
      baseProtein = 13;
      baseCarbs = 130;
      baseFat = 30;
    } else if (childAge < 6) {
      baseCalories = 1400;
      baseProtein = 19;
      baseCarbs = 130;
      baseFat = 40;
    } else if (childAge < 10) {
      baseCalories = 1800;
      baseProtein = 25;
      baseCarbs = 130;
      baseFat = 50;
    } else {
      baseCalories = 2000;
      baseProtein = 30;
      baseCarbs = 130;
      baseFat = 60;
    }

    // Meal-type multipliers
    let mealMultiplier = 0.25; // Default for snacks
    if (mealType === 'breakfast') {
      mealMultiplier = 0.25;
    } else if (mealType === 'lunch' || mealType === 'dinner') {
      mealMultiplier = 0.35;
    }

    return {
      calories: Math.round(baseCalories * mealMultiplier),
      protein: Math.round(baseProtein * mealMultiplier),
      carbs: Math.round(baseCarbs * mealMultiplier),
      fat: Math.round(baseFat * mealMultiplier)
    };
  };

  const generateMealSuggestions = async (replaceDeleted: boolean = false) => {
    if (!selectedChild) {
      setMealSuggestions([]);
      return;
    }

    setLoading(true);
    let cancelled = false;
    const cancelToken = Symbol('mealSuggestions');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (generateMealSuggestions as any)._token = cancelToken;
    
    try {
      const suggestedMealType = getCurrentMealType();
      const childAge = Math.floor((Date.now() - new Date(selectedChild.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      // Use deterministic count for consistent UX
      const numSuggestions = 3;
      
      let excludeIds = [...deletedSuggestionIds];
      
      if (replaceDeleted) {
        // When replacing deleted ones, keep existing suggestions and exclude their IDs too
        excludeIds = [...deletedSuggestionIds, ...mealSuggestions.map(s => s.id)];
      }

      logger.debug('Fetching meal suggestions', { suggestedMealType, childAge, excludeIds });

      let newSuggestions: MealSuggestion[] = [];

      try {
        // First, try Spoonacular API
        logger.info('Trying Spoonacular API first');
        const targetNutrients = calculateTargetNutrients(childAge, suggestedMealType);
        logger.debug('Target nutrients', targetNutrients);

        const spoonacular = await searchMealsByNutrients(
          targetNutrients,
          suggestedMealType,
          childAge,
          numSuggestions
        );
        // Post-filter to ensure deleted IDs never reappear
        newSuggestions = spoonacular.filter(s => !excludeIds.includes(s.id)).slice(0, numSuggestions);
        logger.info('Spoonacular suggestions', newSuggestions.length);
      } catch (spoonacularError) {
        logger.warn('Spoonacular API failed, falling back to Edamam');
        
        try {
          // Fallback to Edamam API
          logger.info('Trying Edamam API as fallback');
          newSuggestions = await searchMealsByMealType(
            suggestedMealType,
            childAge,
            numSuggestions,
            excludeIds
          );
          logger.info('Edamam suggestions', newSuggestions.length);
        } catch (edamamError) {
          logger.error('Both Spoonacular and Edamam APIs failed');
          throw new Error('Both meal suggestion services are unavailable');
        }
      }

      // Final filter safeguard
      const filteredSuggestions = newSuggestions.filter(suggestion => !excludeIds.includes(suggestion.id));

      logger.debug('Final filtered suggestions', filteredSuggestions.length);

      // Ignore late results if another call started
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((generateMealSuggestions as any)._token !== cancelToken) {
        cancelled = true;
        return;
      }
      if (replaceDeleted) {
        // Append new suggestions to existing ones
        setMealSuggestions(prev => [...prev, ...filteredSuggestions]);
      } else {
        // Replace all suggestions
        setMealSuggestions(filteredSuggestions);
        setDeletedSuggestionIds([]); // Reset deleted IDs for fresh start
      }
    } catch (error) {
      logger.error('Error generating meal suggestions', error);
      if (!replaceDeleted) {
        setMealSuggestions([]);
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  const getMoreSuggestions = async () => {
    logger.debug('Getting more suggestions');
    await generateMealSuggestions(true);
  };

  const deleteSuggestion = (suggestionId: string) => {
    logger.debug('Deleting suggestion', suggestionId);
    // Remove from current suggestions
    setMealSuggestions(prev => prev.filter(suggestion => suggestion.id !== suggestionId));
    // Add to deleted IDs to prevent it from appearing again
    setDeletedSuggestionIds(prev => [...prev, suggestionId]);
  };

  useEffect(() => {
    if (!selectedChild) return;
    logger.debug('Selected child changed, generating new suggestions');
    generateMealSuggestions(false);
    // Cleanup cancels previous in-flight call by invalidating token
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (generateMealSuggestions as any)._token = Symbol('cancelled');
    };
  }, [selectedChild?.id]);

  return {
    mealSuggestions,
    loading,
    refreshSuggestions: () => generateMealSuggestions(false),
    getMoreSuggestions,
    deleteSuggestion,
  };
};
