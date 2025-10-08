import { supabase } from '@/integrations/supabase/client';

export interface USDASearchResult {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_size_g: number;
  common_units: string[];
}

export const searchUSDAFoods = async (
  query: string,
  maxResults: number = 10
): Promise<USDASearchResult[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('usda-food-search', {
      body: {
        query,
        maxResults
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error('Failed to search USDA foods');
    }

    return data.foods || [];

  } catch (error) {
    console.error('Error fetching from USDA:', error);
    throw error;
  }
}; 