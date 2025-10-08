
import { supabase } from '@/integrations/supabase/client';

export interface EdamamRecipe {
  recipe: {
    label: string;
    ingredients: Array<{
      text: string;
      weight: number;
    }>;
    calories: number;
    totalTime: number;
    yield: number;
    dietLabels: string[];
    healthLabels: string[];
    totalNutrients: {
      PROCNT?: { label: string; quantity: number; unit: string };
      CHOCDF?: { label: string; quantity: number; unit: string };
      FAT?: { label: string; quantity: number; unit: string };
    };
  };
}

export const searchRecipesByMealType = async (
  mealType: string,
  childAge: number,
  maxResults: number = 5
): Promise<EdamamRecipe[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('edamam-recipes', {
      body: {
        mealType,
        childAge,
        maxResults
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Failed to fetch recipes from Edamam');
    }

    return data.hits || [];

  } catch (error) {
    console.error('Error fetching from Edamam:', error);
    throw error;
  }
};
