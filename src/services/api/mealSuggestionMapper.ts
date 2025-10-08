
import type { SpoonacularRecipe } from './spoonacularClient';

export interface MealSuggestion {
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

export const mapRecipeToMealSuggestion = (
  recipe: SpoonacularRecipe,
  mealType: string
): MealSuggestion => {
  const nutrients = recipe.nutrition?.nutrients || [];
  const calories = nutrients.find(n => n.name === 'Calories')?.amount || 0;
  const protein = nutrients.find(n => n.name === 'Protein')?.amount || 0;
  const carbs = nutrients.find(n => n.name === 'Carbohydrates')?.amount || 0;
  const fat = nutrients.find(n => n.name === 'Fat')?.amount || 0;

  // Determine target nutrients this meal addresses
  const targetNutrientsList = [];
  if (protein > 15) targetNutrientsList.push('protein');
  if (carbs > 30) targetNutrientsList.push('carbs');
  if (fat > 10) targetNutrientsList.push('fat');
  if (calories > 300) targetNutrientsList.push('calories');

  return {
    id: recipe.id.toString(),
    name: recipe.title,
    description: `${Math.round(calories)} cal | ${recipe.readyInMinutes} min prep`,
    ingredients: recipe.extendedIngredients?.slice(0, 6).map(ing => ing.name) || [],
    prepTime: recipe.readyInMinutes || 15,
    servings: recipe.servings || 1,
    targetNutrients: targetNutrientsList,
    mealType,
    difficulty: recipe.readyInMinutes <= 15 ? 'easy' : recipe.readyInMinutes <= 30 ? 'medium' : 'hard',
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10
  };
};
