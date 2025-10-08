
import { searchRecipesByNutrients } from './api/spoonacularClient';
import { mapRecipeToMealSuggestion, type MealSuggestion } from './api/mealSuggestionMapper';
import { getFallbackSuggestions } from './api/fallbackMeals';

export const searchMealsByNutrients = async (
  targetNutrients: { [key: string]: number },
  mealType: string,
  childAge: number,
  maxResults: number = 5
): Promise<MealSuggestion[]> => {
  try {
    const recipes = await searchRecipesByNutrients(targetNutrients, mealType, childAge, maxResults);
    return recipes.map(recipe => mapRecipeToMealSuggestion(recipe, mealType)).slice(0, maxResults);
  } catch (error) {
    console.warn('Spoonacular API unavailable, using fallback suggestions');
    return getFallbackSuggestions(mealType, targetNutrients, maxResults);
  }
};

// Re-export nutrition analysis utilities
export { analyzeNutrientGaps, getNutrientDisplayName, getNutrientUnit } from './nutrition/nutrientAnalysis';
export type { NutrientGap } from './nutrition/nutrientAnalysis';
export type { MealSuggestion } from './api/mealSuggestionMapper';
