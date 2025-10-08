
import type { MealSuggestion } from './mealSuggestionMapper';

export const getFallbackSuggestions = (
  mealType: string,
  targetNutrients: { [key: string]: number },
  maxResults: number
): MealSuggestion[] => {
  const fallbackMeals: { [key: string]: MealSuggestion[] } = {
    breakfast: [
      {
        id: 'fb1',
        name: 'Protein-Rich Scrambled Eggs',
        description: '280 cal | 8 min prep',
        ingredients: ['eggs', 'milk', 'cheese', 'spinach'],
        prepTime: 8,
        servings: 1,
        targetNutrients: ['protein', 'calories'],
        mealType: 'breakfast',
        difficulty: 'easy',
        calories: 280,
        protein: 18,
        carbs: 4,
        fat: 20
      },
      {
        id: 'fb2',
        name: 'Oatmeal with Berries',
        description: '220 cal | 5 min prep',
        ingredients: ['oats', 'milk', 'berries', 'honey'],
        prepTime: 5,
        servings: 1,
        targetNutrients: ['carbs', 'calories'],
        mealType: 'breakfast',
        difficulty: 'easy',
        calories: 220,
        protein: 8,
        carbs: 35,
        fat: 6
      }
    ],
    lunch: [
      {
        id: 'fl1',
        name: 'Chicken & Veggie Wrap',
        description: '380 cal | 10 min prep',
        ingredients: ['chicken breast', 'tortilla', 'lettuce', 'tomato', 'avocado'],
        prepTime: 10,
        servings: 1,
        targetNutrients: ['protein', 'calories'],
        mealType: 'lunch',
        difficulty: 'easy',
        calories: 380,
        protein: 25,
        carbs: 30,
        fat: 15
      }
    ],
    dinner: [
      {
        id: 'fd1',
        name: 'Baked Salmon with Rice',
        description: '420 cal | 25 min prep',
        ingredients: ['salmon fillet', 'brown rice', 'broccoli', 'olive oil'],
        prepTime: 25,
        servings: 1,
        targetNutrients: ['protein', 'fat'],
        mealType: 'dinner',
        difficulty: 'medium',
        calories: 420,
        protein: 30,
        carbs: 35,
        fat: 18
      }
    ],
    snack: [
      {
        id: 'fs1',
        name: 'Apple with Peanut Butter',
        description: '180 cal | 2 min prep',
        ingredients: ['apple', 'peanut butter'],
        prepTime: 2,
        servings: 1,
        targetNutrients: ['carbs', 'fat'],
        mealType: 'snack',
        difficulty: 'easy',
        calories: 180,
        protein: 6,
        carbs: 20,
        fat: 12
      }
    ]
  };

  return fallbackMeals[mealType]?.slice(0, maxResults) || [];
};
