
import type { MealSuggestion } from './mealSuggestionMapper';

const generateRandomId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getEnhancedFallbackSuggestions = (
  mealType: string,
  maxResults: number,
  excludeIds: string[] = []
): MealSuggestion[] => {
  const allMeals: { [key: string]: MealSuggestion[] } = {
    breakfast: [
      {
        id: generateRandomId('fb'),
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
        id: generateRandomId('fb'),
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
      },
      {
        id: generateRandomId('fb'),
        name: 'Whole Grain Toast with Avocado',
        description: '240 cal | 5 min prep',
        ingredients: ['whole grain bread', 'avocado', 'tomato', 'salt'],
        prepTime: 5,
        servings: 1,
        targetNutrients: ['fat', 'carbs'],
        mealType: 'breakfast',
        difficulty: 'easy',
        calories: 240,
        protein: 6,
        carbs: 25,
        fat: 15
      },
      {
        id: generateRandomId('fb'),
        name: 'Greek Yogurt Parfait',
        description: '200 cal | 3 min prep',
        ingredients: ['greek yogurt', 'granola', 'honey', 'berries'],
        prepTime: 3,
        servings: 1,
        targetNutrients: ['protein', 'carbs'],
        mealType: 'breakfast',
        difficulty: 'easy',
        calories: 200,
        protein: 15,
        carbs: 28,
        fat: 5
      },
      {
        id: generateRandomId('fb'),
        name: 'Banana Pancakes',
        description: '250 cal | 10 min prep',
        ingredients: ['banana', 'eggs', 'flour', 'milk'],
        prepTime: 10,
        servings: 1,
        targetNutrients: ['carbs', 'calories'],
        mealType: 'breakfast',
        difficulty: 'medium',
        calories: 250,
        protein: 10,
        carbs: 35,
        fat: 8
      }
    ],
    lunch: [
      {
        id: generateRandomId('fl'),
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
      },
      {
        id: generateRandomId('fl'),
        name: 'Turkey and Cheese Sandwich',
        description: '320 cal | 5 min prep',
        ingredients: ['turkey slices', 'cheese', 'bread', 'lettuce', 'mustard'],
        prepTime: 5,
        servings: 1,
        targetNutrients: ['protein', 'carbs'],
        mealType: 'lunch',
        difficulty: 'easy',
        calories: 320,
        protein: 22,
        carbs: 28,
        fat: 12
      },
      {
        id: generateRandomId('fl'),
        name: 'Quinoa Salad Bowl',
        description: '350 cal | 15 min prep',
        ingredients: ['quinoa', 'chickpeas', 'cucumber', 'tomato', 'olive oil'],
        prepTime: 15,
        servings: 1,
        targetNutrients: ['protein', 'carbs'],
        mealType: 'lunch',
        difficulty: 'medium',
        calories: 350,
        protein: 15,
        carbs: 45,
        fat: 12
      },
      {
        id: generateRandomId('fl'),
        name: 'Tuna Salad',
        description: '290 cal | 8 min prep',
        ingredients: ['canned tuna', 'mixed greens', 'cherry tomatoes', 'olive oil'],
        prepTime: 8,
        servings: 1,
        targetNutrients: ['protein', 'fat'],
        mealType: 'lunch',
        difficulty: 'easy',
        calories: 290,
        protein: 25,
        carbs: 8,
        fat: 18
      },
      {
        id: generateRandomId('fl'),
        name: 'Veggie Quesadilla',
        description: '300 cal | 12 min prep',
        ingredients: ['tortilla', 'cheese', 'bell peppers', 'onions', 'spinach'],
        prepTime: 12,
        servings: 1,
        targetNutrients: ['carbs', 'fat'],
        mealType: 'lunch',
        difficulty: 'medium',
        calories: 300,
        protein: 12,
        carbs: 32,
        fat: 14
      }
    ],
    dinner: [
      {
        id: generateRandomId('fd'),
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
      },
      {
        id: generateRandomId('fd'),
        name: 'Spaghetti with Meat Sauce',
        description: '450 cal | 20 min prep',
        ingredients: ['pasta', 'ground beef', 'tomato sauce', 'onions', 'garlic'],
        prepTime: 20,
        servings: 1,
        targetNutrients: ['carbs', 'protein'],
        mealType: 'dinner',
        difficulty: 'medium',
        calories: 450,
        protein: 22,
        carbs: 55,
        fat: 12
      },
      {
        id: generateRandomId('fd'),
        name: 'Grilled Chicken with Sweet Potato',
        description: '380 cal | 30 min prep',
        ingredients: ['chicken breast', 'sweet potato', 'green beans', 'herbs'],
        prepTime: 30,
        servings: 1,
        targetNutrients: ['protein', 'carbs'],
        mealType: 'dinner',
        difficulty: 'medium',
        calories: 380,
        protein: 28,
        carbs: 40,
        fat: 8
      },
      {
        id: generateRandomId('fd'),
        name: 'Beef Stir Fry',
        description: '360 cal | 15 min prep',
        ingredients: ['beef strips', 'mixed vegetables', 'soy sauce', 'rice', 'ginger'],
        prepTime: 15,
        servings: 1,
        targetNutrients: ['protein', 'carbs'],
        mealType: 'dinner',
        difficulty: 'medium',
        calories: 360,
        protein: 24,
        carbs: 30,
        fat: 14
      },
      {
        id: generateRandomId('fd'),
        name: 'Vegetable Curry with Rice',
        description: '320 cal | 25 min prep',
        ingredients: ['mixed vegetables', 'coconut milk', 'curry spices', 'rice'],
        prepTime: 25,
        servings: 1,
        targetNutrients: ['carbs', 'fat'],
        mealType: 'dinner',
        difficulty: 'medium',
        calories: 320,
        protein: 8,
        carbs: 45,
        fat: 12
      }
    ],
    snack: [
      {
        id: generateRandomId('fs'),
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
      },
      {
        id: generateRandomId('fs'),
        name: 'Mixed Nuts and Dried Fruit',
        description: '160 cal | 1 min prep',
        ingredients: ['almonds', 'walnuts', 'dried cranberries'],
        prepTime: 1,
        servings: 1,
        targetNutrients: ['fat', 'carbs'],
        mealType: 'snack',
        difficulty: 'easy',
        calories: 160,
        protein: 5,
        carbs: 15,
        fat: 11
      },
      {
        id: generateRandomId('fs'),
        name: 'Cheese and Crackers',
        description: '140 cal | 2 min prep',
        ingredients: ['cheese slices', 'whole grain crackers'],
        prepTime: 2,
        servings: 1,
        targetNutrients: ['protein', 'carbs'],
        mealType: 'snack',
        difficulty: 'easy',
        calories: 140,
        protein: 8,
        carbs: 12,
        fat: 8
      },
      {
        id: generateRandomId('fs'),
        name: 'Banana with Almond Butter',
        description: '200 cal | 2 min prep',
        ingredients: ['banana', 'almond butter'],
        prepTime: 2,
        servings: 1,
        targetNutrients: ['carbs', 'fat'],
        mealType: 'snack',
        difficulty: 'easy',
        calories: 200,
        protein: 6,
        carbs: 25,
        fat: 10
      },
      {
        id: generateRandomId('fs'),
        name: 'Yogurt with Granola',
        description: '150 cal | 2 min prep',
        ingredients: ['yogurt', 'granola', 'honey'],
        prepTime: 2,
        servings: 1,
        targetNutrients: ['protein', 'carbs'],
        mealType: 'snack',
        difficulty: 'easy',
        calories: 150,
        protein: 8,
        carbs: 20,
        fat: 4
      }
    ]
  };

  const availableMeals = allMeals[mealType] || [];
  
  // Filter out excluded IDs and shuffle
  const filteredMeals = availableMeals.filter(meal => !excludeIds.includes(meal.id));
  const shuffled = [...filteredMeals].sort(() => Math.random() - 0.5);
  
  return shuffled.slice(0, maxResults);
};
