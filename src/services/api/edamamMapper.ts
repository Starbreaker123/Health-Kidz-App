
import type { EdamamRecipe } from './edamamClient';
import type { MealSuggestion } from './mealSuggestionMapper';

export const mapEdamamToMealSuggestion = (
  edamamRecipe: EdamamRecipe,
  mealType: string
): MealSuggestion => {
  const recipe = edamamRecipe.recipe;
  const calories = Math.round(recipe.calories / recipe.yield);
  const protein = recipe.totalNutrients.PROCNT?.quantity ? Math.round((recipe.totalNutrients.PROCNT.quantity / recipe.yield) * 10) / 10 : 0;
  const carbs = recipe.totalNutrients.CHOCDF?.quantity ? Math.round((recipe.totalNutrients.CHOCDF.quantity / recipe.yield) * 10) / 10 : 0;
  const fat = recipe.totalNutrients.FAT?.quantity ? Math.round((recipe.totalNutrients.FAT.quantity / recipe.yield) * 10) / 10 : 0;

  // Generate unique ID based on recipe name and type
  const id = `edamam-${recipe.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${mealType}`;

  // Determine target nutrients this meal addresses
  const targetNutrientsList = [];
  if (protein > 10) targetNutrientsList.push('protein');
  if (carbs > 20) targetNutrientsList.push('carbs');
  if (fat > 8) targetNutrientsList.push('fat');
  if (calories > 200) targetNutrientsList.push('calories');

  return {
    id,
    name: recipe.label,
    description: `${calories} cal per serving | ${recipe.totalTime || 15} min prep`,
    ingredients: recipe.ingredients.slice(0, 6).map(ing => ing.text.split(',')[0].trim()),
    prepTime: recipe.totalTime || 15,
    servings: recipe.yield || 1,
    targetNutrients: targetNutrientsList,
    mealType,
    difficulty: (recipe.totalTime || 15) <= 15 ? 'easy' : (recipe.totalTime || 15) <= 30 ? 'medium' : 'hard',
    calories,
    protein,
    carbs,
    fat
  };
};
