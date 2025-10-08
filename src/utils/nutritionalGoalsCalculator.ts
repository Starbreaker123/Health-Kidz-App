import { calculateClinicalNutritionRecommendations } from '@/utils/clinicalNutritionCalculator';

interface Child {
  id: string;
  name: string;
  birth_date: string;
  gender?: string;
  weight_kg?: number;
  height_cm?: number;
  activity_level?: string;
  daily_calorie_goal?: number;
}

export const calculateNutritionalGoals = (
  selectedChild: Child | undefined,
  dailyIntake: Record<string, number>
) => {
  if (!selectedChild) return [];

  const recommendations = calculateClinicalNutritionRecommendations(selectedChild);
  
  return [
    { 
      nutrient: 'calories', 
      current: dailyIntake.calories || 0, 
      target: recommendations.calories,
      unit: 'cal', 
      displayName: 'Calories' 
    },
    { 
      nutrient: 'protein_g', 
      current: dailyIntake.protein_g || 0, 
      target: recommendations.protein_g, 
      unit: 'g', 
      displayName: 'Protein' 
    },
    { 
      nutrient: 'carbs_g', 
      current: dailyIntake.carbs_g || 0, 
      target: recommendations.carbs_g, 
      unit: 'g', 
      displayName: 'Carbs' 
    },
    { 
      nutrient: 'fat_g', 
      current: dailyIntake.fat_g || 0, 
      target: recommendations.fat_g, 
      unit: 'g', 
      displayName: 'Fat' 
    }
  ];
};
