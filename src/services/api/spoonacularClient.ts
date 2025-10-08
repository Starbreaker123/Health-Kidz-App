
import { supabase } from '@/integrations/supabase/client';

interface SpoonacularRecipe {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  image: string;
  nutrition?: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  extendedIngredients?: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
}

export const searchRecipesByNutrients = async (
  targetNutrients: { [key: string]: number },
  mealType: string,
  childAge: number,
  maxResults: number = 5
): Promise<SpoonacularRecipe[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('spoonacular-recipes', {
      body: {
        targetNutrients,
        mealType,
        childAge,
        maxResults
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Failed to fetch recipes from Spoonacular');
    }

    return data.results || [];

  } catch (error) {
    console.error('Error fetching from Spoonacular:', error);
    throw error;
  }
};

export type { SpoonacularRecipe };
