
import { searchRecipesByMealType } from './api/edamamClient';
import { mapEdamamToMealSuggestion } from './api/edamamMapper';
import { getEnhancedFallbackSuggestions } from './api/enhancedFallbackMeals';
import type { MealSuggestion } from './api/mealSuggestionMapper';

export const searchMealsByMealType = async (
  mealType: string,
  childAge: number,
  maxResults: number = 5,
  excludeIds: string[] = []
): Promise<MealSuggestion[]> => {
  try {
    const recipes = await searchRecipesByMealType(mealType, childAge, maxResults * 2);
    let suggestions = recipes
      .map(recipe => mapEdamamToMealSuggestion(recipe, mealType))
      .filter(suggestion => !excludeIds.includes(suggestion.id))
      .slice(0, maxResults);

    // If we don't have enough suggestions from API, supplement with fallback
    if (suggestions.length < maxResults) {
      const fallbackNeeded = maxResults - suggestions.length;
      const fallbackSuggestions = getEnhancedFallbackSuggestions(
        mealType, 
        fallbackNeeded,
        [...excludeIds, ...suggestions.map(s => s.id)]
      );
      suggestions = [...suggestions, ...fallbackSuggestions];
    }

    return suggestions;
  } catch (error) {
    console.warn('Edamam API unavailable, using enhanced fallback suggestions');
    return getEnhancedFallbackSuggestions(mealType, maxResults, excludeIds);
  }
};

// Re-export utilities
export { analyzeNutrientGaps, getNutrientDisplayName, getNutrientUnit } from './nutrition/nutrientAnalysis';
export type { NutrientGap } from './nutrition/nutrientAnalysis';
export type { MealSuggestion } from './api/mealSuggestionMapper';
