
interface USDAFood {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }[];
}

export interface FoodSearchResult {
  id: string;
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  serving_size_g: number;
  common_units: string[];
}

// Import the USDA client
import { searchUSDAFoods, type USDASearchResult } from './api/usdaClient';

// Standard unit conversions to grams
export const UNIT_CONVERSIONS = {
  '100g': 100,
  'cup': 185, // Standard cup (cooked rice, pasta, etc.)
  'piece': 120, // Medium piece (apple, banana, etc.)
  'gram': 1,
  'ounce': 28.35,
  'tablespoon': 15,
  'teaspoon': 5,
  'ml': 1, // For liquids, 1ml ≈ 1g
  'slice': 30, // Bread slice
  'serving': 100 // Keep for backward compatibility, but treat as 100g
};

// Unit display labels with gram equivalents
export const UNIT_LABELS = {
  '100g': '100g (standard)',
  'cup': 'cup (185g)',
  'piece': 'piece (120g)',
  'gram': 'gram (1g)',
  'ounce': 'ounce (28g)',
  'tablespoon': 'tablespoon (15g)',
  'teaspoon': 'teaspoon (5g)',
  'ml': 'ml (1g)',
  'slice': 'slice (30g)',
  'serving': '100g (standard)'
};

// Comprehensive fallback food database with common foods
const FALLBACK_FOODS: FoodSearchResult[] = [
  // Proteins
  { id: 'chicken-breast', name: 'Chicken Breast', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6, serving_size_g: 100, common_units: ['100g', 'piece', 'gram', 'ounce'] },
  { id: 'chicken-thigh', name: 'Chicken Thigh', calories_per_100g: 209, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 12, serving_size_g: 100, common_units: ['100g', 'piece', 'gram', 'ounce'] },
  { id: 'ground-beef', name: 'Ground Beef (85% lean)', calories_per_100g: 250, protein_per_100g: 26, carbs_per_100g: 0, fat_per_100g: 15, serving_size_g: 100, common_units: ['100g', 'gram', 'ounce'] },
  { id: 'salmon', name: 'Salmon', calories_per_100g: 208, protein_per_100g: 25, carbs_per_100g: 0, fat_per_100g: 12, serving_size_g: 100, common_units: ['100g', 'piece', 'gram', 'ounce'] },
  { id: 'tuna', name: 'Canned Tuna', calories_per_100g: 144, protein_per_100g: 30, carbs_per_100g: 0, fat_per_100g: 1, serving_size_g: 100, common_units: ['100g', 'gram', 'ounce'] },
  { id: 'eggs', name: 'Eggs', calories_per_100g: 155, protein_per_100g: 13, carbs_per_100g: 1.1, fat_per_100g: 11, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'tofu', name: 'Tofu', calories_per_100g: 76, protein_per_100g: 8, carbs_per_100g: 1.9, fat_per_100g: 4.8, serving_size_g: 100, common_units: ['100g', 'piece', 'gram', 'ounce'] },
  
  // Dairy
  { id: 'milk', name: 'Milk (2%)', calories_per_100g: 50, protein_per_100g: 3.3, carbs_per_100g: 4.8, fat_per_100g: 2, serving_size_g: 100, common_units: ['100g', 'cup', 'ml'] },
  { id: 'cheese', name: 'Cheddar Cheese', calories_per_100g: 403, protein_per_100g: 25, carbs_per_100g: 1.3, fat_per_100g: 33, serving_size_g: 100, common_units: ['100g', 'slice', 'gram', 'ounce'] },
  { id: 'yogurt', name: 'Greek Yogurt', calories_per_100g: 59, protein_per_100g: 10, carbs_per_100g: 3.6, fat_per_100g: 0.4, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  
  // Grains
  { id: 'rice', name: 'White Rice (cooked)', calories_per_100g: 130, protein_per_100g: 2.7, carbs_per_100g: 28, fat_per_100g: 0.3, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'bread', name: 'Whole Wheat Bread', calories_per_100g: 247, protein_per_100g: 13, carbs_per_100g: 41, fat_per_100g: 4.2, serving_size_g: 100, common_units: ['100g', 'slice', 'gram'] },
  { id: 'pasta', name: 'Spaghetti (cooked)', calories_per_100g: 131, protein_per_100g: 5, carbs_per_100g: 25, fat_per_100g: 1.1, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'oats', name: 'Oats', calories_per_100g: 389, protein_per_100g: 17, carbs_per_100g: 66, fat_per_100g: 6.9, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'quinoa', name: 'Quinoa (cooked)', calories_per_100g: 120, protein_per_100g: 4.4, carbs_per_100g: 22, fat_per_100g: 1.9, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  
  // Fruits
  { id: 'banana', name: 'Banana', calories_per_100g: 89, protein_per_100g: 1.1, carbs_per_100g: 23, fat_per_100g: 0.3, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'apple', name: 'Apple', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'orange', name: 'Orange', calories_per_100g: 47, protein_per_100g: 0.9, carbs_per_100g: 12, fat_per_100g: 0.1, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'strawberries', name: 'Strawberries', calories_per_100g: 32, protein_per_100g: 0.7, carbs_per_100g: 8, fat_per_100g: 0.3, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'blueberries', name: 'Blueberries', calories_per_100g: 57, protein_per_100g: 0.7, carbs_per_100g: 14, fat_per_100g: 0.3, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  
  // Vegetables
  { id: 'broccoli', name: 'Broccoli', calories_per_100g: 34, protein_per_100g: 2.8, carbs_per_100g: 7, fat_per_100g: 0.4, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'spinach', name: 'Spinach', calories_per_100g: 23, protein_per_100g: 2.9, carbs_per_100g: 3.6, fat_per_100g: 0.4, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'carrots', name: 'Carrots', calories_per_100g: 41, protein_per_100g: 0.9, carbs_per_100g: 10, fat_per_100g: 0.2, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'tomato', name: 'Tomato', calories_per_100g: 18, protein_per_100g: 0.9, carbs_per_100g: 3.9, fat_per_100g: 0.2, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'cucumber', name: 'Cucumber', calories_per_100g: 16, protein_per_100g: 0.7, carbs_per_100g: 3.6, fat_per_100g: 0.1, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'sweet-potato', name: 'Sweet Potato', calories_per_100g: 86, protein_per_100g: 1.6, carbs_per_100g: 20, fat_per_100g: 0.1, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  { id: 'avocado', name: 'Avocado', calories_per_100g: 160, protein_per_100g: 2, carbs_per_100g: 9, fat_per_100g: 15, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
  
  // Nuts and Seeds
  { id: 'almonds', name: 'Almonds', calories_per_100g: 579, protein_per_100g: 21, carbs_per_100g: 22, fat_per_100g: 50, serving_size_g: 100, common_units: ['100g', 'cup', 'gram', 'ounce'] },
  { id: 'peanut-butter', name: 'Peanut Butter', calories_per_100g: 588, protein_per_100g: 25, carbs_per_100g: 20, fat_per_100g: 50, serving_size_g: 100, common_units: ['100g', 'tablespoon', 'gram'] },
  { id: 'walnuts', name: 'Walnuts', calories_per_100g: 654, protein_per_100g: 15, carbs_per_100g: 14, fat_per_100g: 65, serving_size_g: 100, common_units: ['100g', 'cup', 'gram', 'ounce'] },
  
  // Oils and Fats
  { id: 'olive-oil', name: 'Olive Oil', calories_per_100g: 884, protein_per_100g: 0, carbs_per_100g: 0, fat_per_100g: 100, serving_size_g: 100, common_units: ['100g', 'tablespoon', 'teaspoon', 'ml'] },
  { id: 'butter', name: 'Butter', calories_per_100g: 717, protein_per_100g: 0.9, carbs_per_100g: 0.1, fat_per_100g: 81, serving_size_g: 100, common_units: ['100g', 'tablespoon', 'teaspoon', 'gram'] },
  
  // Legumes
  { id: 'chickpeas', name: 'Chickpeas (cooked)', calories_per_100g: 164, protein_per_100g: 9, carbs_per_100g: 27, fat_per_100g: 2.6, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'black-beans', name: 'Black Beans (cooked)', calories_per_100g: 132, protein_per_100g: 9, carbs_per_100g: 23, fat_per_100g: 0.5, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  
  // Other Common Foods
  { id: 'honey', name: 'Honey', calories_per_100g: 304, protein_per_100g: 0.3, carbs_per_100g: 82, fat_per_100g: 0, serving_size_g: 100, common_units: ['100g', 'tablespoon', 'teaspoon', 'gram'] },
  { id: 'granola', name: 'Granola', calories_per_100g: 471, protein_per_100g: 10, carbs_per_100g: 64, fat_per_100g: 20, serving_size_g: 100, common_units: ['100g', 'cup', 'gram'] },
  { id: 'tortilla', name: 'Flour Tortilla', calories_per_100g: 312, protein_per_100g: 8, carbs_per_100g: 52, fat_per_100g: 8, serving_size_g: 100, common_units: ['100g', 'piece', 'gram'] },
];

export const searchFoods = async (query: string): Promise<FoodSearchResult[]> => {
  if (!query || query.length < 2) return [];

  const searchTerm = query.toLowerCase();
  
  // First, search in our fallback database
  const fallbackResults = FALLBACK_FOODS.filter(food => 
    food.name.toLowerCase().includes(searchTerm)
  );

  // Try USDA API via Edge Function (but don't wait too long)
  let usdaResults: FoodSearchResult[] = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    // Use the new USDA Edge Function
    const usdaSearchResults = await searchUSDAFoods(query, 10);
    usdaResults = usdaSearchResults as FoodSearchResult[];
    
    clearTimeout(timeoutId);
    console.log('USDA API via Edge Function returned:', usdaResults.length, 'results');
    
  } catch (error) {
    console.log('USDA API via Edge Function unavailable, using fallback database');
  }

  // Combine results, prioritizing fallback database for exact matches
  const combinedResults = [...fallbackResults, ...usdaResults];
  
  // Remove duplicates based on name similarity
  const uniqueResults = combinedResults.filter((food, index, self) => 
    index === self.findIndex(f => 
      f.name.toLowerCase() === food.name.toLowerCase()
    )
  );

  return uniqueResults.slice(0, 15); // Limit to 15 results
};

export const calculateNutritionForQuantity = (
  food: FoodSearchResult,
  quantity: number,
  unit: string
): { calories: number; protein: number; carbs: number; fat: number } => {
  // Get grams multiplier from our conversion table
  const gramsMultiplier = UNIT_CONVERSIONS[unit.toLowerCase()] || 1;
  const totalGrams = quantity * gramsMultiplier;
  const factor = totalGrams / 100; // Convert from per-100g to actual amount

  return {
    calories: Math.round(food.calories_per_100g * factor),
    protein: Math.round(food.protein_per_100g * factor * 10) / 10,
    carbs: Math.round(food.carbs_per_100g * factor * 10) / 10,
    fat: Math.round(food.fat_per_100g * factor * 10) / 10
  };
};

// Helper function to get unit label with gram equivalent
export const getUnitLabel = (unit: string): string => {
  return UNIT_LABELS[unit.toLowerCase()] || unit;
};

// Helper function to get grams for a unit
export const getGramsForUnit = (unit: string): number => {
  return UNIT_CONVERSIONS[unit.toLowerCase()] || 1;
};
